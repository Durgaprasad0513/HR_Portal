import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { BoxReveal } from '@/components/ui/modern-animated-sign-in';
import { 
  Plane, Laptop, MessageSquare, FileText, CheckCircle, ArrowRight
} from 'lucide-react';

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

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then((res: any) => res.data),
  });

  if (isStatsLoading) {
    return <div className="p-8 flex justify-center"><LoadingSpinner className="w-10 h-10" /></div>;
  }

  const stats = statsData || {};
  
  const travelCount = stats.moduleOverview?.travel?.pendingApprovals || 0;
  const hardwareCount = stats.moduleOverview?.assets?.assigned || 0;
  const queryCount = 0; // Helpdesk not in stats yet
  const policyCount = 0; // Policy not in stats yet

  return (
    <div className="space-y-6">
      <BoxReveal duration={0.4} disabled={!shouldAnimate}>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4">
          <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">!</div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 mb-1">Harvest Season & Plant QA Audit Advisory</h4>
            <p className="text-xs text-amber-800 leading-relaxed max-w-4xl">
              All quality inspection staff and silo depot coordinators are requested to submit their monthly travel logs and moisture calibration reports before 25-Sep-2026. Review our updated Travel Allowance Policy (TA/DA v3.1) in the documents section.
            </p>
          </div>
        </div>
      </BoxReveal>

      {/* 4 Metric Cards */}
      <BoxReveal duration={0.5} disabled={!shouldAnimate}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/travel')}>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Travel Claims</p>
              <h3 className="text-4xl font-bold text-text-heading mb-1">{travelCount}</h3>
              <p className="text-xs text-slate-500">My Field Tours</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
              <Plane className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/assets')}>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Hard...</p>
              <h3 className="text-4xl font-bold text-text-heading mb-1">{hardwareCount}</h3>
              <p className="text-xs text-slate-500">Issued Equipment</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Laptop className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/requests')}>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">HR Queries</p>
              <h3 className="text-4xl font-bold text-text-heading mb-1">{queryCount}</h3>
              <p className="text-xs text-slate-500">My Helpdesk Tick...</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Policy Complia...</p>
              <h3 className="text-4xl font-bold text-text-heading mb-1">{policyCount}</h3>
              <p className="text-xs text-slate-500">Pending Acknowle...</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
              <FileText className="w-6 h-6" />
            </div>
          </div>

        </div>
      </BoxReveal>

      {/* 2 Wide Cards Row */}
      <BoxReveal duration={0.6} disabled={!shouldAnimate}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-text-heading">Pending Actions</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Corporate documents requiring your digital acknowledgement</p>
              </div>
              <div className="bg-purple-50 px-3 py-1.5 rounded-2xl border border-purple-100 flex flex-col items-center justify-center min-w-[60px]">
                <span className="text-[10px] font-bold text-purple-600">0</span>
                <span className="text-[9px] font-bold text-purple-600">Pending</span>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100/50 rounded-xl p-4 flex gap-3 items-center">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-700 font-medium">All mandatory HR policies are acknowledged! Your compliance status is 100%.</p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-text-heading">My Travel Allowance Status</h3>
                <p className="text-xs text-slate-500 mt-1">Recent tour requests, advances, and bill reimbursements</p>
              </div>
              <button onClick={() => navigate('/travel')} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700 transition-colors bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-center py-8 text-slate-400 text-xs">
              No recent travel records found.
            </div>
          </div>

        </div>
      </BoxReveal>

      {/* Bottom Small Links */}
      <BoxReveal duration={0.7} disabled={!shouldAnimate}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div 
            onClick={() => navigate('/assets')}
            className="bg-surface rounded-2xl p-5 border border-slate-border shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-200 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Laptop className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-text-heading group-hover:text-emerald-700 transition-colors">My Assigned Company Assets</h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Details <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => navigate('/requests')}
            className="bg-surface rounded-2xl p-5 border border-slate-border shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-200 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-text-heading group-hover:text-emerald-700 transition-colors">My HR Queries & Requests</h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Desk <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>
      </BoxReveal>
    </div>
  );
};
