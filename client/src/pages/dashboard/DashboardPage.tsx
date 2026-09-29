import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { ScheduleInterviewModal } from './components/ScheduleInterviewModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/ui/PageHeader';
import { BoxReveal } from '@/components/ui/modern-animated-sign-in';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
 Users, UserMinus, Briefcase, FileText, CheckCircle, Clock, 
 ChevronRight, Calendar, AlertTriangle, Info, ArrowUpRight, ArrowDownRight, Award, MapPin, Plus, ArrowRight, Plane, Receipt, ListTodo, ShieldAlert,
 TrendingUp, TrendingDown,
 BadgePercent, Laptop, UserCheck
} from 'lucide-react';
import { formatDate } from '@/utils/dateFormat';
import clsx from 'clsx';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';
  const isManager = user?.role === 'MANAGER';
  
  const [shouldAnimate] = useState(() => {
    const hasAnimated = sessionStorage.getItem('dashboard_animated');
    if (!hasAnimated) {
      sessionStorage.setItem('dashboard_animated', 'true');
      return true;
    }
    return false;
  });

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 5 * 60 * 1000, 
  });

  const { data: attritionStats } = useQuery({
    queryKey: ['dashboard-attrition-stats', 6],
    queryFn: () => dashboardApi.getAttrition({ periodMonths: 6 }),
    enabled: isAdminOrHR || isManager,
  });

  if (isLoading) {
    return <div className="p-8 flex justify-center"><LoadingSpinner className="w-12 h-12" /></div>;
  }

  if (!data) return null;

  const headline = data.data.headline;
  const overview = data.data.moduleOverview;
  
  // Calculate Pending Action Items for the "Pulse"
  const pendingApprovalsCount = 
    (overview.leave?.pendingApprovals || 0) + 
    (overview.travel?.pendingApprovals || 0) + 
    (overview.expenses?.pendingApprovals || 0);

  const needsAttention = data.data.needsAttention || [];
  const approvals = needsAttention.filter((i: any) => i.action.toLowerCase().includes('approv'));
  const alerts = needsAttention.filter((i: any) => !i.action.toLowerCase().includes('approv'));
  const upcomingInterviews = data.data.upcomingInterviews || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        description={`Welcome back, ${user?.employee?.firstName || 'User'}. Here is your strategic organizational overview.`}
      />

      {/* STRATEGIC TOP ROW: The "Pulse" */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Employees */}
        <BoxReveal duration={0.5} disabled={!shouldAnimate}>
          <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-sm flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
              <Users size={64} />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <p className="text-sm font-semibold text-text-muted">Total Headcount</p>
            </div>
            <div className="mt-auto">
              <h3 className="text-3xl font-bold text-text-heading">{headline.activeEmployees}</h3>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 font-medium">{overview.employees?.joinersThisMonth || 0} joined</span>
                <span className="text-text-muted">this month</span>
              </div>
            </div>
          </div>
        </BoxReveal>

        {/* Attrition */}
        <BoxReveal duration={0.6} disabled={!shouldAnimate}>
          <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-sm flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
              <UserMinus size={64} />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", 
                headline.monthlyAttrition > 5 ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" : "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
              )}>
                <UserMinus size={20} />
              </div>
              <p className="text-sm font-semibold text-text-muted">Attrition Rate</p>
            </div>
            <div className="mt-auto">
              <h3 className="text-3xl font-bold text-text-heading">{headline.monthlyAttrition}%</h3>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ArrowDownRight className="w-4 h-4 text-amber-500" />
                <span className="text-amber-600 font-medium">{overview.employees?.exitsThisMonth || 0} left</span>
                <span className="text-text-muted">this month</span>
              </div>
            </div>
          </div>
        </BoxReveal>

        {/* Pending Actions */}
        <BoxReveal duration={0.7} disabled={!shouldAnimate}>
          <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-sm flex flex-col h-full relative overflow-hidden group cursor-pointer hover:border-brand-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
              <ListTodo size={64} />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-brand-primary-light text-brand-primary flex items-center justify-center shrink-0">
                <ListTodo size={20} />
              </div>
              <p className="text-sm font-semibold text-text-muted">Action Required</p>
            </div>
            <div className="mt-auto">
              <h3 className="text-3xl font-bold text-text-heading">{pendingApprovalsCount + approvals.length}</h3>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className="text-brand-primary font-medium">Pending Approvals</span>
                <span className="text-text-muted">in your queue</span>
              </div>
            </div>
          </div>
        </BoxReveal>

        {/* Vacancies / Talent */}
        <BoxReveal duration={0.8} disabled={!shouldAnimate}>
          <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-sm flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
              <Briefcase size={64} />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Briefcase size={20} />
              </div>
              <p className="text-sm font-semibold text-text-muted">Critical Vacancies</p>
            </div>
            <div className="mt-auto">
              <h3 className="text-3xl font-bold text-text-heading">{headline.openVacancies}</h3>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <UserCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-indigo-600 font-medium">{overview.recruitment?.offersAccepted || 0} accepted</span>
                <span className="text-text-muted">offers this month</span>
              </div>
            </div>
          </div>
        </BoxReveal>
      </div>

      {/* MIDDLE ROW: Trends & Analytics */}
      {(isAdminOrHR || isManager) && attritionStats?.data?.trend && (
        <BoxReveal duration={0.9} disabled={!shouldAnimate}>
          <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-text-heading flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                  Workforce Trend (6 Months)
                </h3>
                <p className="text-sm text-text-muted mt-1">Growth vs. Attrition analysis over time</p>
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attritionStats.data.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-heading)' }}
                    itemStyle={{ color: 'var(--text-heading)' }}
                  />
                  <Area type="monotone" name="Headcount" dataKey="averageHeadcount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
                  <Area type="monotone" name="Exits" dataKey="count" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </BoxReveal>
      )}

      {/* BOTTOM ROW: Actionable Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: My Pending Approvals */}
        <div className="lg:col-span-1 bg-surface rounded-xl shadow-sm border border-slate-border flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-border bg-tint flex items-center justify-between">
            <h3 className="font-bold text-text-heading flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              My Approvals
            </h3>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
              {approvals.length + pendingApprovalsCount}
            </span>
          </div>
          <div className="p-0 flex-1 flex flex-col">
            {approvals.length > 0 || pendingApprovalsCount > 0 ? (
              <div className="divide-y divide-slate-border">
                {/* Aggregate dynamic overview counts */}
                {overview.leave?.pendingApprovals > 0 && (
                  <Link to="/leave" className="flex items-center justify-between p-4 hover:bg-tint transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-heading">Leave Requests</p>
                        <p className="text-xs text-text-muted">{overview.leave.pendingApprovals} awaiting approval</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </Link>
                )}
                {overview.travel?.pendingApprovals > 0 && (
                  <Link to="/travel" className="flex items-center justify-between p-4 hover:bg-tint transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Plane size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-heading">Travel Requests</p>
                        <p className="text-xs text-text-muted">{overview.travel.pendingApprovals} awaiting approval</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </Link>
                )}
                {overview.expenses?.pendingApprovals > 0 && (
                  <Link to="/expenses" className="flex items-center justify-between p-4 hover:bg-tint transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Receipt size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-heading">Expense Claims</p>
                        <p className="text-xs text-text-muted">{overview.expenses.pendingApprovals} awaiting approval</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </Link>
                )}
                
                {/* Dynamic specific approvals from needsAttention */}
                {approvals.map((item: any) => (
                  <Link key={item.id} to={item.link} className="flex flex-col gap-1 p-4 hover:bg-tint transition-colors group">
                    <p className="text-sm font-semibold text-text-heading line-clamp-1">{item.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-text-muted flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {item.action}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <CheckCircle className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-text-muted text-sm">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Widget 2: Strategic Alerts */}
        <div className="lg:col-span-1 bg-surface rounded-xl shadow-sm border border-slate-border flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-border bg-tint flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-text-heading">Strategic Alerts</h3>
          </div>
          <div className="p-0 flex-1 flex flex-col">
            {alerts.length > 0 ? (
              <div className="divide-y divide-slate-border">
                {alerts.map((item: any) => (
                  <Link key={item.id} to={item.link} className="flex flex-col gap-1 p-4 hover:bg-tint transition-colors group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{item.module}</span>
                      {item.dueDate && <span className="text-xs font-medium text-rose-500">Due {formatDate(item.dueDate)}</span>}
                    </div>
                    <p className="text-sm font-semibold text-text-heading">{item.title}</p>
                    <p className="text-xs text-text-muted mt-1">{item.action}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShieldAlert className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-text-muted text-sm">No critical alerts detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* Widget 3: Recruitment & Interviews */}
        <div className="lg:col-span-1 bg-surface rounded-xl shadow-sm border border-slate-border flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-border bg-tint flex items-center justify-between">
            <h3 className="font-bold text-text-heading flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-primary" />
              Upcoming Interviews
            </h3>
            <Link to="/recruitment" className="text-xs font-semibold text-brand-primary hover:underline">View All</Link>
          </div>
          <div className="p-0 flex-1 flex flex-col">
            {upcomingInterviews.length > 0 ? (
              <div className="divide-y divide-slate-border">
                {upcomingInterviews.map((interview: any) => (
                  <div key={interview.id} className="p-4 flex gap-3 hover:bg-tint transition-colors">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex flex-col items-center justify-center shrink-0 border border-brand-primary/20">
                      <span className="text-[10px] font-bold text-brand-primary uppercase">{formatDate(interview.scheduledDate).split(' ')[1]}</span>
                      <span className="text-xs font-bold text-brand-primary">{formatDate(interview.scheduledDate).split(' ')[0]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-text-heading truncate">{interview.candidateName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-muted truncate max-w-[120px]">{interview.requisitionTitle}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">{interview.interviewType}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mb-3" />
                <p className="text-text-muted text-sm mb-4">Your calendar is clear.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
