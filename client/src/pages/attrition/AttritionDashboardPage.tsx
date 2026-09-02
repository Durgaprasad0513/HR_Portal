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
    <div className="p-6 pb-20">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white mb-1">Employee Attrition Dashboard</h1>
          <p className="text-sm text-gray-500">Trailing 12-Month Attrition & Headcount Analytics</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-lg border border-indigo-100 dark:border-indigo-800 flex flex-col items-center">
          <span className="text-xs uppercase font-bold tracking-wider opacity-80">Avg Employee Strength</span>
          <span className="text-2xl font-black">{stats?.averageStrength || 0}</span>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Attrition (Last Month)</h3>
          <p className="text-3xl font-bold text-navy-900 dark:text-white mt-2">{mAttr}%</p>
          <p className="text-xs text-red-500 mt-1 font-medium">{recentMonth.exits} separations</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Quarterly Attrition (Last 3 Mos)</h3>
          <p className="text-3xl font-bold text-navy-900 dark:text-white mt-2">{qAttr}%</p>
          <p className="text-xs text-red-500 mt-1 font-medium">{qExits} separations</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Annual Attrition (12 Mos)</h3>
          <p className="text-3xl font-bold text-navy-900 dark:text-white mt-2">{annualAttr}%</p>
          <p className="text-xs text-red-500 mt-1 font-medium">{stats?.attritionCount || 0} separations</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Voluntary vs Involuntary</h3>
          <div className="mt-2 flex items-end gap-2">
            <p className="text-3xl font-bold text-red-500">{stats?.voluntaryExits || 0}</p>
            <span className="text-sm text-gray-400 mb-1">Vol</span>
            <span className="text-2xl font-light text-gray-300 ml-1 mr-1">/</span>
            <p className="text-3xl font-bold text-orange-500">{stats?.involuntaryExits || 0}</p>
            <span className="text-sm text-gray-400 mb-1">Invol</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* New Joiners vs Exits */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">New Joiners vs Exits (12 Mos)</h3>
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
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Department-wise Attrition</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart layout="vertical" data={stats?.departmentBreakdown || []} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={100} />
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Bar dataKey="count"
                  nameKey="name" name="Separations" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Designation Breakdown */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 lg:col-span-2">
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Designation-wise Attrition</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <BarChart data={stats?.designationBreakdown || []} margin={{ top: 5, right: 0, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Bar dataKey="count"
                  nameKey="name" name="Separations" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Breakdown */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Location-wise Attrition</h3>
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
                  nameKey="name"
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
