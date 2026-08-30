import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { recruitmentApi } from '@/api/recruitment';
import { Users, CheckCircle, Clock } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CountUp } from '@/components/ui/CountUp';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then((res: any) => res.data),
  });

  const { data: reqData } = useQuery({
    queryKey: ['requisitions'],
    queryFn: recruitmentApi.getRequisitions,
  });

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  const stats = data || {};

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-heading">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">
          Welcome back, {user?.employee?.firstName || user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-accent-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Total Employees</p>
              <h3 className="text-2xl font-bold text-text-heading"><CountUp end={stats.totalEmployees || 0} /></h3>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Pending Travel/Leaves</p>
              <h3 className="text-2xl font-bold text-text-heading"><CountUp end={(stats.pendingTravel || 0) + (stats.pendingLeaves || 0)} /></h3>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Assets Assigned</p>
              <h3 className="text-2xl font-bold text-text-heading"><CountUp end={stats.totalAssets || 0} /></h3>
            </div>
          </div>
        </div>
        
        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Open Requisitions</p>
              <h3 className="text-2xl font-bold text-text-heading"><CountUp end={stats.openRequisitions || 0} /></h3>
            </div>
          </div>
        </div>
      </div>


      {/* Recruitment Widget */}
      <div className="mt-8 border-t border-slate-border pt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-heading flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Recruitment Process
            </h2>
          </div>
          <a href="/recruitment" className="text-sm font-medium text-accent-600 hover:text-accent-700">View All {'>'}</a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table Area */}
          <div className="lg:col-span-2 bg-surface rounded-xl shadow-sm border border-slate-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 border-b border-slate-border bg-tint">
              <div className="bg-surface p-4 rounded-lg border border-blue-100">
                <div className="text-blue-600 font-bold flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <CountUp end={stats.openRequisitions || 0} />
                </div>
                <div className="text-xs font-medium text-text-muted">Job Openings</div>
              </div>
              <div className="bg-surface p-4 rounded-lg border border-purple-100">
                <div className="text-purple-600 font-bold flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4" />
                  <CountUp end={reqData?.data?.reduce((acc: number, r: any) => acc + (r._count?.candidates || 0), 0) || 0} />
                </div>
                <div className="text-xs font-medium text-text-muted">Total Candidates</div>
              </div>
              <div className="bg-surface p-4 rounded-lg border border-orange-100">
                <div className="text-orange-600 font-bold flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <CountUp end={12} />
                </div>
                <div className="text-xs font-medium text-text-muted">Invited for interview</div>
              </div>
              <div className="bg-surface p-4 rounded-lg border border-green-100">
                <div className="text-green-600 font-bold flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <CountUp end={5} />
                </div>
                <div className="text-xs font-medium text-text-muted">Waiting for feedbacks</div>
              </div>
            </div>

            {/* Jobs Table */}
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-tint text-text-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">JOB</th>
                    <th className="px-5 py-3 font-semibold">VACANCIES</th>
                    <th className="px-5 py-3 font-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reqData?.data?.slice(0, 4).map((req: any) => (
                    <tr key={req.id} className="hover:bg-tint cursor-pointer" onClick={() => window.location.href='/recruitment'}>
                      <td className="px-5 py-4 font-medium text-text-heading">{req.positionTitle}</td>
                      <td className="px-5 py-4 text-text-muted">{req.vacancies}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          req.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                          req.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!reqData?.data?.length && (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-text-muted">No active job openings</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ongoing Process Area */}
          <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
            <h3 className="font-bold text-text-heading mb-4">Ongoing process</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">JD</div>
                  <div>
                    <p className="text-sm font-medium text-text-heading">John Davis</p>
                    <p className="text-xs text-text-muted">Sales Executive</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Interview</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">MJ</div>
                  <div>
                    <p className="text-sm font-medium text-text-heading">Matthew Johnson</p>
                    <p className="text-xs text-text-muted">Senior UI/UX Designer</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Task Test</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">JW</div>
                  <div>
                    <p className="text-sm font-medium text-text-heading">Jessica Wilson</p>
                    <p className="text-xs text-text-muted">Social Content Manager</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Interview</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">EH</div>
                  <div>
                    <p className="text-sm font-medium text-text-heading">Elizabeth Hall</p>
                    <p className="text-xs text-text-muted">Sales Executive</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Offer sent</span>
              </div>
            </div>
            <button className="w-full mt-6 py-2 text-sm font-medium text-accent-600 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors" onClick={() => window.location.href='/recruitment'}>
              View All Candidates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
