import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { leavesApi } from '@/api/leaves';
import { performanceApi } from '@/api/performance';
import { assetsApi } from '@/api/assets';
import { expensesApi } from '@/api/expenses';
import { travelApi } from '@/api/travel';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BoxReveal } from '@/components/ui/modern-animated-sign-in';
import { 
  Calendar, Clock, Plane, Receipt, 
  CheckCircle, XCircle, AlertCircle, Award, Star,
  Laptop, ArrowRight
} from 'lucide-react';
import { formatDate } from '@/utils/dateFormat';
import clsx from 'clsx';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [shouldAnimate] = useState(() => {
    const hasAnimated = sessionStorage.getItem('emp_dashboard_animated');
    if (!hasAnimated) {
      sessionStorage.setItem('emp_dashboard_animated', 'true');
      return true;
    }
    return false;
  });

  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then((res: any) => res.data),
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

  const { data: performanceData, isLoading: loadingPerformance } = useQuery({
    queryKey: ['my-performance'],
    queryFn: () => performanceApi.getMyReviews(),
    enabled: !!user?.employee?.id,
  });

  const { data: assetsData, isLoading: loadingAssets } = useQuery({
    queryKey: ['my-assets'],
    queryFn: () => assetsApi.getAll(),
    enabled: !!user?.employee?.id,
  });

  const { data: myExpensesData } = useQuery({
    queryKey: ['my-expenses'],
    queryFn: () => expensesApi.getAll(),
  });

  const { data: myTravelData } = useQuery({
    queryKey: ['my-travel'],
    queryFn: () => travelApi.getAll(),
  });

  if (loadingBalances || loadingLeaves || loadingPerformance || loadingAssets) {
    return <div className="p-8 flex justify-center"><LoadingSpinner className="w-10 h-10" /></div>;
  }

  const balances = (balancesData as any)?.data || [];
  const assets = (assetsData as any)?.data || [];
  const recentLeaves = ((myLeavesData as any)?.data || []).slice(0, 5);
  const reviews = (performanceData as any)?.data || [];
  const latestReview = reviews.length > 0 ? reviews[reviews.length - 1] : null;

  // Build recent requests from real expense & travel data
  const myExpenses = ((myExpensesData as any)?.data || [])
    .slice(0, 2)
    .map((e: any) => ({
      id: e.id,
      title: e.description || e.category?.replace(/_/g, ' ') || 'Expense',
      sub: 'Office Expense',
      status: e.status,
      link: '/office-expenses',
      icon: <Receipt size={18} />,
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    }));

  const myTravel = ((myTravelData as any)?.data || [])
    .slice(0, 2)
    .map((t: any) => ({
      id: t.id,
      title: t.destination || 'Travel Request',
      sub: 'Travel Request',
      status: t.status,
      link: '/travel',
      icon: <Plane size={18} />,
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    }));

  const recentRequests = [...myExpenses, ...myTravel].slice(0, 4);

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
      case 'APPROVED': return <CheckCircle className="w-3.5 h-3.5" />;
      case 'REJECTED': return <XCircle className="w-3.5 h-3.5" />;
      case 'PENDING': return <Clock className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'REJECTED': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* ROW 1: Performance & Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <BoxReveal duration={0.6} disabled={!shouldAnimate}>
          <div className="bg-surface rounded-xl p-6 border border-slate-border shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-heading">My Performance</h3>
              <Link to="/performance" className="text-xs font-semibold text-brand-primary hover:underline">View All</Link>
            </div>
            
            {latestReview ? (
              <div className="flex flex-col h-full justify-center space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-muted">Review Period</span>
                  <span className="text-sm font-bold bg-tint px-3 py-1 rounded-full text-brand-primary">{latestReview.reviewPeriod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-muted">Status</span>
                  <span className="text-sm font-bold text-text-heading">{latestReview.status.replace('_', ' ')}</span>
                </div>
                {latestReview.finalRating ? (
                  <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Star className="fill-current w-5 h-5" />
                      <span className="font-bold text-text-heading">Rating</span>
                    </div>
                    <span className="text-lg font-black text-brand-primary">{latestReview.finalRating} / 5</span>
                  </div>
                ) : (
                  <div className="mt-2 p-3 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Review is currently in progress
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-text-heading mb-1">No Reviews Yet</p>
                <p className="text-xs text-text-muted">Your performance reviews will appear here once assigned.</p>
              </div>
            )}
          </div>
        </BoxReveal>

        {/* Assigned Assets */}
        <BoxReveal duration={0.7} disabled={!shouldAnimate}>
          <div className="bg-surface rounded-xl p-6 border border-slate-border shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-heading">Assigned Assets</h3>
              <Link to="/assets" className="text-xs font-semibold text-brand-primary hover:underline">View All</Link>
            </div>
            
            {assets.length > 0 ? (
              <div className="space-y-3 overflow-y-auto max-h-[140px] pr-2">
                {assets.slice(0, 3).map((asset: any) => (
                  <div key={asset.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <div className="w-8 h-8 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 flex items-center justify-center shrink-0">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-heading truncate">{asset.assetName}</p>
                      <p className="text-xs text-text-muted truncate">{asset.assetId}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <Laptop className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-text-heading mb-1">No Assets Assigned</p>
                <p className="text-xs text-text-muted">You have no active company assets.</p>
              </div>
            )}
          </div>
        </BoxReveal>
      </div>

      {/* ROW 2: Needs Attention | My Leave History | Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Card 1: Needs Attention */}
        <BoxReveal duration={0.5} disabled={!shouldAnimate}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-text-heading">Needs Attention</h3>
            </div>
            <div className="bg-surface rounded-xl border border-slate-border shadow-sm flex-1 flex flex-col overflow-hidden">
              {statsData?.needsAttention?.length > 0 ? (
                <div className="divide-y divide-slate-border flex-1">
                  {statsData.needsAttention.slice(0, 4).map((item: any) => (
                    <Link key={item.id} to={item.link} className="flex flex-col gap-1 p-4 hover:bg-tint transition-colors group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-brand-primary bg-tint px-2 py-0.5 rounded-full">{item.module}</span>
                        {item.dueDate && <span className="text-xs font-medium text-rose-500">Due {formatDate(item.dueDate)}</span>}
                      </div>
                      <p className="text-sm font-semibold text-text-heading group-hover:text-brand-primary transition-colors line-clamp-1">{item.title}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <p className="font-medium text-text-heading mb-1">All caught up!</p>
                  <p className="text-xs text-text-muted">No pending approvals or urgent items.</p>
                </div>
              )}
            </div>
          </div>
        </BoxReveal>

        {/* Card 2 (Middle): My Recent Leave History */}
        <BoxReveal duration={0.6} disabled={!shouldAnimate}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-text-heading">My Leave History</h3>
              <Link to="/leaves" className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-surface rounded-xl border border-slate-border shadow-sm flex-1 flex flex-col overflow-hidden">
              {recentLeaves.length > 0 ? (
                <div className="divide-y divide-slate-border flex-1">
                  {recentLeaves.map((leave: any) => {
                    const d = new Date(leave.startDate);
                    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
                    const dateNum = d.getDate();
                    return (
                      <div key={leave.id} className="p-4 flex items-center justify-between hover:bg-tint transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                            <span className="text-[9px] font-bold text-slate-500 uppercase">{month}</span>
                            <span className="text-sm font-bold text-text-heading">{dateNum}</span>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-text-heading line-clamp-1">{leave.leaveType?.replace('_', ' ') || leave.leaveType}</p>
                            <p className="text-xs text-text-muted mt-0.5">{leave.days} day(s) &bull; {leave.reason}</p>
                          </div>
                        </div>
                        <div className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shrink-0", getLeaveStatusColor(leave.status))}>
                          {getStatusIcon(leave.status)}
                          <span className="hidden sm:inline">{leave.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center flex flex-col items-center justify-center text-slate-400 flex-1">
                  <Calendar className="w-12 h-12 mb-3 text-slate-300" />
                  <p className="text-sm font-semibold text-text-heading mb-1">No leave history</p>
                  <p className="text-xs">You haven't taken any time off recently.</p>
                </div>
              )}
            </div>
          </div>
        </BoxReveal>

        {/* Card 3: Recent Requests Tracker */}
        <BoxReveal duration={0.7} disabled={!shouldAnimate}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-text-heading">Recent Requests</h3>
            </div>
            <div className="bg-surface rounded-xl border border-slate-border shadow-sm flex-1 flex flex-col overflow-hidden">
              {recentRequests.length > 0 ? (
                <div className="divide-y divide-slate-border flex-1">
                  {recentRequests.map((req: any) => (
                    <Link key={req.id} to={req.link} className="p-4 flex items-center justify-between hover:bg-tint transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", req.iconBg)}>
                          {req.icon}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-text-heading line-clamp-1 group-hover:text-brand-primary transition-colors">{req.title}</p>
                          <p className="text-xs text-text-muted mt-0.5">{req.sub}</p>
                        </div>
                      </div>
                      <div className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shrink-0", getStatusColor(req.status))}>
                        {getStatusIcon(req.status)}
                        <span className="hidden sm:inline">{req.status || 'PENDING'}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center flex flex-col items-center justify-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <Receipt className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-text-heading mb-1">No recent requests</p>
                  <p className="text-xs text-text-muted">Your expense and travel requests will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </BoxReveal>

      </div>
    </div>
  );
};
