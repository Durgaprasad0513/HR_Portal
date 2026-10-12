import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowRight, IndianRupee } from 'lucide-react';
import { BoxReveal } from '@/components/ui/modern-animated-sign-in';

type AttendancePoint = {
  date: string;
  present: number;
  absent: number;
};

type ExpenseSummaryItem = {
  name: string;
  color: string;
  hex: string;
  value: number;
};

export type DashboardChartsProps = {
  attendanceTrend?: AttendancePoint[];
  expenseSummary: ExpenseSummaryItem[];
  isAdminOrHR: boolean;
  shouldAnimate: boolean;
  onViewExpenses: () => void;
};

export function DashboardCharts({
  attendanceTrend,
  expenseSummary,
  isAdminOrHR,
  shouldAnimate,
  onViewExpenses,
}: DashboardChartsProps) {
  return (
    <>
      {isAdminOrHR && attendanceTrend && (
        <BoxReveal disabled={!shouldAnimate} boxColor="var(--skeleton)" duration={0.5} width="100%" className="h-full">
          <div className="min-w-0 w-full bg-surface rounded-xl shadow-sm border border-slate-border p-5">
            <h3 className="font-bold text-text-heading mb-4 text-sm uppercase tracking-wider">Attendance (7 Days)</h3>
            <div className="h-48 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrend} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
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
        </BoxReveal>
      )}

      <BoxReveal disabled={!shouldAnimate} boxColor="var(--skeleton)" duration={0.5} width="100%" className="h-full">
        <div className="min-w-0 w-full bg-surface rounded-xl shadow-sm border border-slate-border p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-text-heading text-sm uppercase tracking-wider">Office Expenses</h3>
              <p className="text-xs text-text-muted mt-1">Expense distribution across operational cost centers</p>
            </div>
            <button onClick={onViewExpenses} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer">
              Expenses <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex-1 flex flex-col 2xl:flex-row items-center justify-center gap-6 2xl:gap-8 w-full min-w-0 mt-4">
            <div className="w-56 h-56 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseSummary} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none">
                    {expenseSummary.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.hex} />)}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹${Number(value ?? 0).toLocaleString('en-IN')}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-4 flex-1 w-full max-w-xs justify-center">
              {expenseSummary.map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-text-muted font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-text-heading flex items-center">
                    <IndianRupee className="w-3.5 h-3.5 inline mr-0.5" />{item.value.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BoxReveal>
    </>
  );
}
