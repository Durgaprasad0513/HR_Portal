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
      {/* 4 Metric Cards */}
      <BoxReveal duration={0.5} disabled={!shouldAnimate}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          
          <div 
            onClick={() => navigate('/travel')}
            className="bg-surface rounded-2xl p-5 md:p-6 border border-slate-border shadow-sm flex items-center justify-between hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all cursor-pointer active:scale-[0.98]"
          >
            <div>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Travel Claims</p>
              <h3 className="text-3xl md:text-4xl font-bold text-text-heading mb-1">{travelCount}</h3>
              <p className="text-[10px] md:text-xs text-slate-500">My Field Tours</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 shrink-0">
              <Plane className="w-6 h-6" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/assets')}
            className="bg-surface rounded-2xl p-5 md:p-6 border border-slate-border shadow-sm flex items-center justify-between hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all cursor-pointer active:scale-[0.98]"
          >
            <div>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Hard...</p>
              <h3 className="text-3xl md:text-4xl font-bold text-text-heading mb-1">{hardwareCount}</h3>
              <p className="text-[10px] md:text-xs text-slate-500">Issued Equipment</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/requests')}
            className="bg-surface rounded-2xl p-5 md:p-6 border border-slate-border shadow-sm flex items-center justify-between hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all cursor-pointer active:scale-[0.98]"
          >
            <div>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">HR Queries</p>
              <h3 className="text-3xl md:text-4xl font-bold text-text-heading mb-1">{queryCount}</h3>
              <p className="text-[10px] md:text-xs text-slate-500">My Helpdesk Tick...</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/policies')}
            className="bg-surface rounded-2xl p-5 md:p-6 border border-slate-border shadow-sm flex items-center justify-between hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all cursor-pointer active:scale-[0.98]"
          >
            <div>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Policy Complia...</p>
              <h3 className="text-3xl md:text-4xl font-bold text-text-heading mb-1">{policyCount}</h3>
              <p className="text-[10px] md:text-xs text-slate-500">Pending Acknowle...</p>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
          </div>

        </div>
      </BoxReveal>

      {/* 2 Wide Cards Row */}
      <BoxReveal duration={0.6} disabled={!shouldAnimate}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          
          <div 
            onClick={() => navigate('/policies')}
            className="bg-surface rounded-2xl p-5 md:p-6 border border-slate-border shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all cursor-pointer active:scale-[0.98] group"
          >
            <div className="flex items-start justify-between mb-8 gap-4">
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-bold text-text-heading group-hover:text-emerald-700 transition-colors">Pending Actions</h3>
                <p className="text-xs md:text-sm text-slate-500 mt-1">Corporate documents requiring your digital acknowledgement</p>
              </div>
              <div className="bg-purple-50 px-3 py-1.5 rounded-2xl border border-purple-100 flex flex-col items-center justify-center min-w-[60px] shrink-0">
                <span className="text-[10px] font-bold text-purple-600">0</span>
                <span className="text-[9px] font-bold text-purple-600">Pending</span>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100/50 rounded-xl p-4 flex gap-3 items-center">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-xs md:text-sm text-emerald-700 font-medium">All mandatory HR policies are acknowledged! Your compliance status is 100%.</p>
            </div>
          </div>

          <div 
            onClick={() => navigate('/travel')}
            className="bg-surface rounded-2xl p-5 md:p-6 border border-slate-border shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all cursor-pointer active:scale-[0.98] group"
          >
            <div className="flex items-start justify-between mb-8 gap-4">
              <div className="min-w-0">
                <h3 className="text-base md:text-lg font-bold text-text-heading group-hover:text-emerald-700 transition-colors">My Travel Allowance Status</h3>
                <p className="text-xs md:text-sm text-slate-500 mt-1">Recent tour requests, advances, and bill reimbursements</p>
              </div>
              <button className="text-xs md:text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:text-emerald-700 transition-colors bg-emerald-50 group-hover:bg-emerald-100 px-3 py-1.5 rounded-full shrink-0">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-center py-8 text-slate-400 text-xs md:text-sm">
              No recent travel records found.
            </div>
          </div>

        </div>
      </BoxReveal>

      {/* Bottom Small Links */}
      <BoxReveal duration={0.7} disabled={!shouldAnimate}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          
          <div 
            onClick={() => navigate('/assets')}
            className="bg-surface rounded-2xl p-5 md:p-6 border border-slate-border shadow-sm flex items-center justify-between hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all cursor-pointer active:scale-[0.98] group gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Laptop className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 shrink-0" />
              <h3 className="text-sm md:text-base font-bold text-text-heading group-hover:text-emerald-700 transition-colors truncate">My Assigned Company Assets</h3>
            </div>
            <span className="text-xs md:text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
              Details <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </span>
          </div>

          <div 
            onClick={() => navigate('/requests')}
            className="bg-surface rounded-2xl p-5 md:p-6 border border-slate-border shadow-sm flex items-center justify-between hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all cursor-pointer active:scale-[0.98] group gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 shrink-0" />
              <h3 className="text-sm md:text-base font-bold text-text-heading group-hover:text-emerald-700 transition-colors truncate">My HR Queries & Requests</h3>
            </div>
            <span className="text-xs md:text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
              Open Desk <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </span>
          </div>

        </div>
      </BoxReveal>
    </div>
  );
};
