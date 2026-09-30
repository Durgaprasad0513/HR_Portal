import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { leavesApi } from '@/api/leaves';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BoxReveal } from '@/components/ui/modern-animated-sign-in';
import { 
  Calendar, Clock, Plane, Receipt, User, ArrowRight,
  CheckCircle, XCircle, AlertCircle, Coffee
} from 'lucide-react';
import { formatDate } from '@/utils/dateFormat';
import clsx from 'clsx';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  
  const [shouldAnimate] = useState(() => {
    const hasAnimated = sessionStorage.getItem('emp_dashboard_animated');
    if (!hasAnimated) {
      sessionStorage.setItem('emp_dashboard_animated', 'true');
      return true;
    }
    return false;
  });

  const { data: balancesData, isLoading: loadingBalances } = useQuery({
    queryKey: ['leave-balances', user?.employee?.id],
    queryFn: () => leavesApi.getBalances(),
    enabled: !!user?.employee?.id,
  });

  const { data: myLeavesData, isLoading: loadingLeaves } = useQuery({
    queryKey: ['my-leaves'],
    queryFn: () => leavesApi.getMyLeaves(),
  });

  if (loadingBalances || loadingLeaves) {
    return <div className="p-8 flex justify-center"><LoadingSpinner className="w-10 h-10" /></div>;
  }

  const balances = (balancesData as any)?.data || [];
  const recentLeaves = ((myLeavesData as any)?.data || []).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'REJECTED': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <XCircle className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* ROW 1: Profile & Balances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Snapshot */}
        <BoxReveal duration={0.5} disabled={!shouldAnimate}>
          <div className="bg-surface rounded-xl p-6 border border-slate-border shadow-sm flex flex-col h-full bg-gradient-to-br from-brand-primary/5 to-transparent">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-primary text-white flex items-center justify-center text-2xl font-bold shadow-md">
                {user?.employee?.firstName?.[0] || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-heading">{user?.employee?.firstName} {user?.employee?.lastName}</h2>
                <p className="text-brand-primary font-medium text-sm mb-1">{user?.employee?.designation}</p>
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <span className="bg-white/50 px-2 py-0.5 rounded-full border border-slate-200">{user?.employee?.employeeCode}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-border/50 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted mb-1">Department</p>
                <p className="text-sm font-semibold text-text-heading">{user?.employee?.department?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Reporting To</p>
                <p className="text-sm font-semibold text-text-heading">
                  {user?.employee?.manager ? `${user?.employee?.manager.firstName} ${user?.employee?.manager.lastName}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </BoxReveal>

        {/* Leave Balances */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {balances.map((balance: any, index: number) => {
            const percentage = (balance.usedBalance / balance.totalBalance) * 100;
            const remaining = balance.totalBalance - balance.usedBalance;
            return (
              <BoxReveal key={balance.id} duration={0.6 + (index * 0.1)} disabled={!shouldAnimate}>
                <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-sm flex flex-col h-full items-center text-center">
                  <h3 className="text-sm font-bold text-text-heading mb-1">{balance.leaveType.name}</h3>
                  <p className="text-xs text-text-muted mb-4">{balance.leaveType.code}</p>
                  
                  {/* Simple Circular Progress (CSS based) */}
                  <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        stroke="currentColor" strokeWidth="3" fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={remaining < 3 ? "text-rose-500" : "text-emerald-500"}
                        strokeDasharray={`${percentage}, 100`}
                        stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-text-heading">{remaining}</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted mt-auto">Remaining of {balance.totalBalance}</p>
                </div>
              </BoxReveal>
            );
          })}
        </div>
      </div>

      {/* ROW 2: Quick Actions & Recent Leaves */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="font-bold text-text-heading text-lg">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Link to="/leave/apply" className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-slate-border hover:border-brand-primary hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Coffee size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-text-heading group-hover:text-brand-primary transition-colors">Apply Leave</h4>
                <p className="text-xs text-text-muted">Request time off</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
            </Link>
            
            <Link to="/travel" className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-slate-border hover:border-brand-primary hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plane size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-text-heading group-hover:text-brand-primary transition-colors">Travel Request</h4>
                <p className="text-xs text-text-muted">Plan business travel</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/expenses" className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-slate-border hover:border-brand-primary hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Receipt size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-text-heading group-hover:text-brand-primary transition-colors">Claim Expense</h4>
                <p className="text-xs text-text-muted">Submit bills for reimbursement</p>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-heading text-lg">My Recent Leaves</h3>
            <Link to="/leave" className="text-sm font-semibold text-brand-primary hover:underline">View All</Link>
          </div>
          
          <div className="bg-surface rounded-xl border border-slate-border shadow-sm overflow-hidden">
            {recentLeaves.length > 0 ? (
              <div className="divide-y divide-slate-border">
                {recentLeaves.map((leave: any) => (
                  <div key={leave.id} className="p-4 flex items-center justify-between hover:bg-tint transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{formatDate(leave.startDate).split(' ')[1]}</span>
                        <span className="text-sm font-bold text-text-heading">{formatDate(leave.startDate).split(' ')[0]}</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text-heading">{leave.leaveType.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{leave.days} day(s) &bull; {leave.reason}</p>
                      </div>
                    </div>
                    <div className={clsx("flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold", getStatusColor(leave.status))}>
                      {getStatusIcon(leave.status)}
                      {leave.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center flex flex-col items-center justify-center text-slate-400">
                <Calendar className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-medium text-text-heading mb-1">No recent leaves</p>
                <p className="text-xs">You haven't taken any time off recently.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
