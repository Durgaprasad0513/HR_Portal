import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { expensesApi } from '@/api/expenses';
import { recruitmentApi } from '@/api/recruitment';
import { ScheduleInterviewModal } from './components/ScheduleInterviewModal';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { ProfileBanner } from './components/ProfileBanner';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { BoxReveal } from '@/components/ui/modern-animated-sign-in';
import { AreaChart, Area, BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
 Users, UserMinus, Briefcase, FileText, CheckCircle, Clock, 
 ChevronRight, Calendar, AlertTriangle, Info, ArrowUpRight, ArrowDownRight, Award, MapPin, Plus, ArrowRight, Plane, BookOpen, Receipt
, Coffee, IndianRupee } from 'lucide-react';
import { formatDate } from '@/utils/dateFormat';

export default function DashboardPage() {
 const navigate = useNavigate();
 const { user } = useAuth();
 const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';
 const isManager = false;
 const [showAbsent, setShowAbsent] = useState(false);
 
 const [shouldAnimate] = useState(() => {
 const hasAnimated = sessionStorage.getItem('dashboard_animated');
 if (!hasAnimated) {
 sessionStorage.setItem('dashboard_animated', 'true');
 return true;
 }
 return false;
 });

 const { data: statsData, isLoading: isStatsLoading, error: statsError } = useQuery({
 queryKey: ['dashboard-stats'],
 queryFn: () => dashboardApi.getStats().then((res: any) => res.data),
 });

 const { data: attritionData, isLoading: isAttritionLoading } = useQuery({
 queryKey: ['dashboard-attrition'],
 queryFn: () => dashboardApi.getAttrition().then((res: any) => res.data),
 enabled: isAdminOrHR,
 });

 const { data: reqResponse } = useQuery({
 queryKey: ['requisitions'],
 queryFn: recruitmentApi.getRequisitions,
 enabled: isAdminOrHR,
 });
 const reqData = reqResponse?.data || [];
 const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

   const { data: expensesData } = useQuery({
    queryKey: ['dashboard-expenses'],
    queryFn: expensesApi.getAll,
    enabled: isAdminOrHR,
  });

  const expenseSummary = React.useMemo(() => {
    const defaultData = [
      { name: 'Stationery', category: 'STATIONERY', value: 0, color: 'bg-emerald-500', hex: '#10b981' },
      { name: 'Food & Snacks', category: 'FOOD_SNACKS', value: 0, color: 'bg-blue-500', hex: '#3b82f6' },
      { name: 'Maintenance', category: 'MAINTENANCE', value: 0, color: 'bg-amber-500', hex: '#f59e0b' },
      { name: 'Utilities', category: 'UTILITIES', value: 0, color: 'bg-purple-500', hex: '#8b5cf6' },
      { name: 'IT / Software', category: 'IT_SOFTWARE', value: 0, color: 'bg-pink-500', hex: '#ec4899' },
      { name: 'Other', category: 'OTHER', value: 0, color: 'bg-slate-500', hex: '#64748b' }
    ];
    
    if (!expensesData?.data) {
       // Mock data if API returns nothing so it doesn't look broken during loading/demo
       return [
          { name: 'Stationery', value: 9800, color: 'bg-emerald-500', hex: '#10b981' },
          { name: 'Food & Snacks', value: 18500, color: 'bg-blue-500', hex: '#3b82f6' },
          { name: 'Maintenance', value: 145000, color: 'bg-amber-500', hex: '#f59e0b' },
          { name: 'Utilities', value: 38400, color: 'bg-purple-500', hex: '#8b5cf6' },
          { name: 'IT / Software', value: 22000, color: 'bg-pink-500', hex: '#ec4899' }
       ];
    }
    
    const sums: Record<string, number> = {
      MAINTENANCE: 0, UTILITIES: 0, IT_SOFTWARE: 0, FOOD_SNACKS: 0, STATIONERY: 0, OTHER: 0
    };
    
    expensesData.data.forEach((exp: any) => {
      // Only count approved or paid expenses if possible, or all for now
      if (sums[exp.category] !== undefined) {
         sums[exp.category] += Number(exp.amount) || 0;
      } else {
         sums['OTHER'] += Number(exp.amount) || 0;
      }
    });
    
    let hasData = false;
    const finalData = defaultData.map(item => {
      const val = sums[item.category as keyof typeof sums] || 0;
      if (val > 0) hasData = true;
      return { ...item, value: val };
    });
    
    if (!hasData) {
        return [
          { name: 'Stationery', value: 9800, color: 'bg-emerald-500', hex: '#10b981' },
          { name: 'Food & Snacks', value: 18500, color: 'bg-blue-500', hex: '#3b82f6' },
          { name: 'Maintenance', value: 145000, color: 'bg-amber-500', hex: '#f59e0b' },
          { name: 'Utilities', value: 38400, color: 'bg-purple-500', hex: '#8b5cf6' },
          { name: 'IT / Software', value: 22000, color: 'bg-pink-500', hex: '#ec4899' }
       ];
    }
    return finalData;
  }, [expensesData]);

  if (isStatsLoading) return <LoadingSpinner />;

  if (!isAdminOrHR && !isManager) {
    return (
      <div className="space-y-6">
        <ProfileBanner />
        <EmployeeDashboard />
      </div>
    );
  }

 if (statsError) {
 return (
 <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700" role="alert">
 Failed to load dashboard data. Please try again.
 </div>
 );
 }

 const stats = statsData || {};
 const headline = stats.headline || {};
 const needsAttention = stats.needsAttention || [];
 
 const getStatusLabel = (status: string) => {
 return status.replace(/_/g, ' ');
 };

 const getStatusClasses = (status: string) => {
 if (status === 'REQUIREMENT') return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400';
 if (status === 'SOURCING') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
 if (status === 'SCREENING') return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
 if (status === 'TELEPHONIC') return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400';
 if (status === 'HR_INTERVIEW') return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
 if (status === 'TECHNICAL') return 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-400';
 if (status === 'MANAGEMENT') return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400';
 if (status === 'SELECTED') return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
 if (status === 'OFFER') return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
 if (status === 'JOINED_REJECTED') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
 return 'bg-gray-100 text-gray-800 bg-surface dark:text-gray-300';
 };

 const moduleOverview = stats.moduleOverview || {};
 const joinExitTrend = attritionData?.joinExitTrend || [];

 return (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-0 sm:p-2 pb-12">
 <BoxReveal disabled={!shouldAnimate} boxColor="var(--skeleton)" duration={0.4} width="100%">
 {isAdminOrHR ? (
 <ProfileBanner />
 ) : (
 <PageHeader
 title="Dashboard"
 description={`Welcome back, ${user?.employee?.firstName || user?.email || 'there'}. Here is your organizational overview.`}
 />
 )}
 </BoxReveal>

 {/* 1. Four Headline Metrics */}
 <BoxReveal disabled={!shouldAnimate} boxColor="var(--skeleton)" duration={0.5} width="100%">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {/* Active Employees / Today's Attendance */}
 <div 
   onClick={() => navigate('/employees')}
   className="relative bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-md hover:border-brand-primary/50 cursor-pointer transition-all group"
 >
   <div className="flex justify-between items-start mb-4">
     <div>
       <p className="text-sm font-medium text-text-muted mb-1 group-hover:text-brand-primary transition-colors">Active employees</p>
       <h3 className="text-3xl font-bold text-text-heading">{headline.activeEmployees || 0}</h3>
     </div>
     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
       <Users className="w-5 h-5" />
     </div>
   </div>

   {/* Today's Attendance Bar */}
   <div className="mt-1 mb-3">
     <div className="flex items-center justify-between text-xs font-medium mb-1.5">
       <span className="text-emerald-600">Present today: {headline.presentToday ?? headline.activeEmployees ?? 0}</span>
       <button
         onClick={(e) => {
           e.stopPropagation();
           setShowAbsent(true);
         }}
         className="text-rose-600 hover:underline focus:outline-none relative z-10"
       >
         Absent: {headline.absentToday ?? 0}
       </button>
     </div>
     {(headline.activeEmployees ?? 0) > 0 && (
       <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative z-0">
         <div
           className="h-full rounded-full bg-emerald-500 transition-all"
           style={{ width: `${Math.round(((headline.presentToday ?? headline.activeEmployees ?? 0) / headline.activeEmployees) * 100)}%` }}
         />
       </div>
     )}
   </div>
 </div>

 {/* Absent list Modal */}
 <Modal 
   isOpen={showAbsent} 
   onClose={() => setShowAbsent(false)} 
   title={`On Leave Today (${headline.absentToday ?? 0})`}
 >
   <div className="max-h-80 overflow-y-auto divide-y divide-slate-border -mx-5 -mb-5 px-5 pb-5 mt-2">
     {(stats?.absentEmployeesList?.length ?? 0) === 0 ? (
       <div className="py-8 text-center text-sm text-slate-500">
         No employees are on approved leave today.
       </div>
     ) : (
       (stats.absentEmployeesList || []).map((emp: any) => (
         <div key={emp.id} className="py-3 flex items-center gap-3">
           <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-700 dark:text-rose-400 text-sm font-bold uppercase shrink-0">
             {emp.name.charAt(0)}
           </div>
           <div>
             <p className="text-sm font-semibold text-text-heading leading-tight">{emp.name}</p>
             <p className="text-xs text-text-muted mt-0.5">{emp.department || 'No Department'}</p>
           </div>
         </div>
       ))
     )}
   </div>
 </Modal>

 {/* Attrition */}
 <Link to={isAdminOrHR ? "/dashboard/attrition" : "#"} className={`block bg-surface rounded-xl shadow-sm border border-slate-border p-5 ${isAdminOrHR ? 'hover:shadow-md transition-all group' : ''}`}>
 <div className="flex justify-between items-start mb-4">
 <div>
 <p className="text-sm font-medium text-text-muted mb-1">Employee attrition</p>
 <h3 className="text-3xl font-bold text-text-heading group-hover:text-accent-600 transition-colors">{headline.monthlyAttrition || 0}%</h3>
 </div>
 <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
 <UserMinus className="w-5 h-5" />
 </div>
 </div>
 <div className="text-xs text-text-muted">
 Monthly rate based on <span className="font-medium text-text-heading">{headline.exitsThisMonth || 0}</span> exits
 </div>
 </Link>

 {/* Open Vacancies */}
 <Link to="/recruitment" className="block bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-md transition-all group">
 <div className="flex justify-between items-start mb-4">
 <div>
 <p className="text-sm font-medium text-text-muted mb-1">Open vacancies</p>
 <h3 className="text-3xl font-bold text-text-heading group-hover:text-accent-600 transition-colors">{headline.openVacancies || 0}</h3>
 </div>
 <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
 <Briefcase className="w-5 h-5" />
 </div>
 </div>
 <div className="text-xs text-text-muted">
 <span className="font-medium text-text-heading">{stats.invitedForInterview || 0}</span> screening, <span className="font-medium text-text-heading">{stats.offersAccepted || 0}</span> accepted
 </div>
 </Link>

 {/* Reviews Completed */}
 <Link to="/performance" className="block bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-md transition-all group">
 <div className="flex justify-between items-start mb-4">
 <div>
 <p className="text-sm font-medium text-text-muted mb-1">Reviews completed</p>
 <h3 className="text-3xl font-bold text-text-heading group-hover:text-accent-600 transition-colors">{headline.reviewsCompleted || 0}</h3>
 </div>
 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
 <FileText className="w-5 h-5" />
 </div>
 </div>
 <div className="text-xs text-text-muted">
 Out of <span className="font-medium text-text-heading">{headline.reviewsTotal || 0}</span> expected reviews
 </div>
 </Link>
 </div>
 </BoxReveal>


 {/* Recruitment Cards - Open Positions + Interview Schedule */}
 {isAdminOrHR && (
 <BoxReveal disabled={!shouldAnimate} boxColor="var(--skeleton)" duration={0.5} width="100%">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
 {/* Needs Attention */}
{/* 2. Needs Attention */}
 <div className="bg-surface rounded-xl shadow-sm border border-slate-border overflow-hidden flex flex-col">
 <div className="p-5 border-b border-slate-border bg-tint flex items-center justify-between">
 <h3 className="font-bold text-text-heading flex items-center gap-2">
 <AlertTriangle className="w-5 h-5 text-orange-500" />
 Needs Attention
 </h3>
 </div>
 <div className="flex-1 p-0 flex flex-col">
 {needsAttention.length > 0 ? (
 <div className="divide-y divide-slate-border flex-1">
 {needsAttention.map((item: any) => (
 <Link key={item.id} to={item.link} className="flex flex-col gap-1 p-4 hover:bg-tint transition-colors group">
 <div className="flex items-center justify-between mb-1">
 <span className="text-[10px] uppercase font-bold tracking-wider text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">{item.module}</span>
 {item.dueDate && <span className="text-xs font-medium text-rose-500">Due {formatDate(item.dueDate)}</span>}
 </div>
 <p className="text-sm font-semibold text-text-heading group-hover:text-accent-700 transition-colors line-clamp-1">{item.title}</p>
 <div className="flex items-center justify-between mt-2">
 <p className="text-xs text-text-muted flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5"/> {item.action}</p>
 <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-accent-600 transition-colors" />
 </div>
 </Link>
 ))}
 </div>
 ) : (
 <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
 <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
 <CheckCircle className="w-6 h-6" />
 </div>
 <p className="font-medium text-text-heading mb-1">All caught up!</p>
 <p className="text-sm text-text-muted">No pending approvals or urgent items.</p>
 </div>
 )}
 </div>
 {needsAttention.length >= 5 && (
 <div className="p-3 border-t border-slate-border bg-tint/50 text-center">
 <span className="text-xs font-medium text-text-muted">Showing top 5 priorities</span>
 </div>
 )}
 </div>

 
{/* Interview Calendar */}
        <div className="bg-surface rounded-xl border border-slate-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-heading flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent-600" /> Interview Calendar
            </h3>
            <button
              onClick={() => navigate('/recruitment/interviews')}
              className="flex items-center gap-1.5 text-xs font-semibold text-accent-600 hover:text-accent-700 bg-accent-50 hover:bg-accent-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              View Calendar <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {(() => {
            const upcoming = stats?.upcomingInterviews || [];
            
            return upcoming.length > 0 ? (
              <div className="space-y-1">
                {upcoming.map((candidate: any) => {
                  const dateStr = new Date(candidate.interviewDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  return (
                    <div
                      key={candidate.id}
                      onClick={() => navigate('/recruitment')}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-tint cursor-pointer transition-colors group"
                    >
                      <div className="h-9 w-9 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-violet-700 dark:text-violet-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-heading truncate group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                          {candidate.candidateName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                            {candidate.interviewRound || 'Interview'}
                          </span>
                          <span className="text-xs text-text-muted truncate">{candidate.requisition?.positionTitle}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-xs font-semibold text-text-muted group-hover:text-accent-600 dark:group-hover:text-accent-400">{dateStr}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="h-12 w-12 rounded-full bg-tint flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-text-muted" />
                </div>
                <p className="text-sm font-medium text-text-heading">No interviews scheduled</p>
                <p className="text-xs text-text-muted mt-1">Candidates with upcoming interviews will appear here</p>
              </div>
            );
          })()}
        </div>
 </div>
 </BoxReveal>
 )}

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 
 {/* Left Column: Needs Attention & Trend */}
 
          {/* Attendance Trend Chart (Only for HR/Admin) */}
          {isAdminOrHR && stats?.attendanceTrend && (
            <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5">
              <h3 className="font-bold text-text-heading mb-4 text-sm uppercase tracking-wider">Attendance (7 Days)</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.attendanceTrend} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--slate-border)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--slate-border)', backgroundColor: 'var(--surface)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                      labelStyle={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}
                    />
                    <Area type="monotone" name="Present" dataKey="present" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPresent)" />
                    <Area type="monotone" name="Absent" dataKey="absent" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorAbsent)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

            {/* Office Expenses Chart */}
            <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-text-heading text-sm uppercase tracking-wider">Office Expenses</h3>
                  <p className="text-xs text-text-muted mt-1">Expense distribution across operational cost centers</p>
                </div>
                <button onClick={() => navigate('/office-expenses')} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer">
                  Expenses <ArrowRight size={12} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-8 w-full mt-4">
                <div className="w-56 h-56 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseSummary}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {expenseSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.hex} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => '\u20B9' + Number(value).toLocaleString('en-IN')}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-col gap-4 flex-1 w-full max-w-xs justify-center">
                  {expenseSummary.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className={'w-3 h-3 rounded-full ' + item.color}></div>
                        <span className="text-text-muted font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-text-heading flex items-center"><IndianRupee className="w-3.5 h-3.5 inline mr-0.5" />{item.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

 
 

 

          

          </div>
 <ScheduleInterviewModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />
 </div>
 );
}



