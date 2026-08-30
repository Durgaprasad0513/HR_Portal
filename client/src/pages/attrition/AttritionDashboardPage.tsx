import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AttritionDashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['attrition-stats'],
    queryFn: () => dashboardApi.getAttrition().then((res: any) => res.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-6 text-red-500">Failed to load attrition stats.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold tracking-tight text-navy-900 mb-6">Attrition Dashboard (12-Month Trailing)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Overall Attrition Rate</h3>
          <p className="text-3xl font-bold text-navy-900 mt-2">{stats?.attritionRate || 0}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Leavers</h3>
          <p className="text-3xl font-bold text-navy-900 mt-2">{stats?.attritionCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Headcount at Start</h3>
          <p className="text-3xl font-bold text-navy-900 mt-2">{stats?.headcountAtStart || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Department Breakdown</h3>
          <div className="space-y-4">
            {stats?.departmentBreakdown?.map((d: any) => (
              <div key={d.department} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{d.department}</span>
                <span className="font-semibold text-navy-900">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">6-Month Join Trend</h3>
          <div className="space-y-4">
            {stats?.joinTrend?.map((t: any) => (
              <div key={t.month} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t.month}</span>
                <span className="font-semibold text-emerald-600">+{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
