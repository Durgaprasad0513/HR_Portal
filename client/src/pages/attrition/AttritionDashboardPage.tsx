import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a28dda', '#f472b6'];
const PIE_COLORS = ['#ef4444', '#f59e0b']; // Voluntary/Involuntary

export default function AttritionDashboardPage() {
  const { data: statsData, isLoading, error } = useQuery({
    queryKey: ['attrition-stats'],
    queryFn: () => dashboardApi.getAttrition().then((res: any) => res.data),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-6 text-red-500">Failed to load attrition stats.</div>;

  const stats = statsData;

  // Derive Monthly, Quarterly, Annual estimates from trend for summary cards
  const annualAttr = stats?.attritionRate || 0;
  const recentQuarter = stats?.joinExitTrend?.slice(-3) || [];
  const qExits = recentQuarter.reduce((acc: number, cur: any) => acc + cur.exits, 0);
  const qAttr = stats?.averageStrength > 0 ? ((qExits / stats.averageStrength) * 100).toFixed(1) : 0;
  
  const recentMonth = stats?.joinExitTrend?.slice(-1)[0] || { exits: 0 };
  const mAttr = stats?.averageStrength > 0 ? ((recentMonth.exits / stats.averageStrength) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-heading mb-1">Employee Attrition Dashboard</h1>
          <p className="text-sm text-text-muted">Trailing 12-Month Attrition & Headcount Analytics</p>
        </div>
        <div className="bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 px-4 py-2 rounded-lg border border-accent-100 dark:border-accent-800 flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Avg Employee Strength</span>
          <span className="text-xl font-black">{stats?.averageStrength || 0}</span>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Monthly Attrition</p>
              <h3 className="text-2xl font-bold text-text-heading">{mAttr}%</h3>
              <p className="text-xs text-red-500 font-medium">{recentMonth.exits} separations</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Quarterly Attrition</p>
              <h3 className="text-2xl font-bold text-text-heading">{qAttr}%</h3>
              <p className="text-xs text-red-500 font-medium">{qExits} separations</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Annual Attrition</p>
              <h3 className="text-2xl font-bold text-text-heading">{annualAttr}%</h3>
              <p className="text-xs text-red-500 font-medium">{stats?.attritionCount || 0} separations</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
              <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Vol vs Invol</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-red-500">{stats?.voluntaryExits || 0}</span>
                <span className="text-xs text-gray-400">V</span>
                <span className="text-lg font-light text-gray-300 mx-1">/</span>
                <span className="text-2xl font-bold text-orange-500">{stats?.involuntaryExits || 0}</span>
                <span className="text-xs text-gray-400">I</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Joiners vs Exits */}
        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-heading">New Joiners vs Exits (12 Mos)</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={stats?.joinExitTrend || []} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Legend iconType="circle" />
                <Bar dataKey="joins" name="New Joiners" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exits" name="Exits" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-heading">Department-wise Attrition</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart layout="vertical" data={stats?.departmentBreakdown || []} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={100} />
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Bar dataKey="count"
                   name="Separations" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Designation Breakdown */}
        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-heading">Designation-wise Attrition</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={stats?.designationBreakdown || []} margin={{ top: 5, right: 0, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Bar dataKey="count"
                   name="Separations" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Breakdown */}
        <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-heading">Location-wise Attrition</h3>
          </div>
          <div className="h-64 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.locationBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="count"
                  
                >
                  {(stats?.locationBreakdown || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
