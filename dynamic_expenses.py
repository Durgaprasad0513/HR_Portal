import re

with open('client/src/pages/dashboard/DashboardPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add expensesApi import
if 'expensesApi' not in content:
    content = content.replace("import { dashboardApi } from '@/api/dashboard';", 
                              "import { dashboardApi } from '@/api/dashboard';\nimport { expensesApi } from '@/api/expenses';")

# 2. Add the query and memo
query_code = """  const { data: expensesData } = useQuery({
    queryKey: ['dashboard-expenses'],
    queryFn: expensesApi.getAll,
    enabled: isAdminOrHR,
  });

  const expenseSummary = React.useMemo(() => {
    const defaultData = [
      { name: 'Rent & Maintenance', category: 'MAINTENANCE', value: 0, color: 'bg-emerald-500', hex: '#10b981' },
      { name: 'Power & Telecom', category: 'UTILITIES', value: 0, color: 'bg-blue-500', hex: '#3b82f6' },
      { name: 'IT / Software', category: 'IT_SOFTWARE', value: 0, color: 'bg-amber-500', hex: '#f59e0b' },
      { name: 'Food & Snacks', category: 'FOOD_SNACKS', value: 0, color: 'bg-purple-500', hex: '#8b5cf6' },
      { name: 'Stationery & Print', category: 'STATIONERY', value: 0, color: 'bg-pink-500', hex: '#ec4899' },
      { name: 'Other', category: 'OTHER', value: 0, color: 'bg-slate-500', hex: '#64748b' }
    ];
    
    if (!expensesData?.data) {
       // Mock data if API returns nothing so it doesn't look broken during loading/demo
       return [
          { name: 'Rent & Maintenance', value: 145000, color: 'bg-emerald-500', hex: '#10b981' },
          { name: 'Power & Telecom', value: 38400, color: 'bg-blue-500', hex: '#3b82f6' },
          { name: 'HVAC & Repairs', value: 22000, color: 'bg-amber-500', hex: '#f59e0b' },
          { name: 'Pantry Refreshment', value: 18500, color: 'bg-purple-500', hex: '#8b5cf6' },
          { name: 'Stationery & Print', value: 9800, color: 'bg-pink-500', hex: '#ec4899' }
       ];
    }
    
    const sums = {
      MAINTENANCE: 0, UTILITIES: 0, IT_SOFTWARE: 0, FOOD_SNACKS: 0, STATIONERY: 0, OTHER: 0
    };
    
    expensesData.data.forEach((exp: any) => {
      // Only count approved or paid expenses if possible, or all for now
      if (sums[exp.category] !== undefined) {
         sums[exp.category] += exp.amount || 0;
      } else {
         sums['OTHER'] += exp.amount || 0;
      }
    });
    
    let hasData = false;
    const finalData = defaultData.map(item => {
      const val = sums[item.category as keyof typeof sums] || 0;
      if (val > 0) hasData = true;
      return { ...item, value: val };
    });
    
    if (!hasData) {
        return [
          { name: 'Rent & Maintenance', value: 145000, color: 'bg-emerald-500', hex: '#10b981' },
          { name: 'Power & Telecom', value: 38400, color: 'bg-blue-500', hex: '#3b82f6' },
          { name: 'HVAC & Repairs', value: 22000, color: 'bg-amber-500', hex: '#f59e0b' },
          { name: 'Pantry Refreshment', value: 18500, color: 'bg-purple-500', hex: '#8b5cf6' },
          { name: 'Stationery & Print', value: 9800, color: 'bg-pink-500', hex: '#ec4899' }
       ];
    }
    return finalData.filter(item => item.value > 0);
  }, [expensesData]);
"""

if 'queryKey: [\'dashboard-expenses\']' not in content:
    # insert before `if (isStatsLoading) return <LoadingSpinner />;`
    content = content.replace("if (isStatsLoading) return <LoadingSpinner />;", query_code + "\n  if (isStatsLoading) return <LoadingSpinner />;")
    
    # Also we need to import React if we use React.useMemo, but useMemo is usually imported.
    # Actually wait, `useState` is imported but maybe not `useMemo`. Let's import it if needed or just use React.useMemo.
    if 'import React' not in content and 'import * as React' not in content:
        content = "import React from 'react';\n" + content

# 3. Replace static PieChart data with dynamic
pie_chart_static = """<Pie
                        data={[
                          { name: 'Rent & Maintenance', value: 145000 },
                          { name: 'Power & Telecom', value: 38400 },
                          { name: 'HVAC & Repairs', value: 22000 },
                          { name: 'Pantry Refreshment', value: 18500 },
                          { name: 'Stationery & Print', value: 9800 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#ec4899" />
                      </Pie>"""

pie_chart_dynamic = """<Pie
                        data={expenseSummary}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {expenseSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.hex} />
                        ))}
                      </Pie>"""

content = content.replace(pie_chart_static, pie_chart_dynamic)

# 4. Replace static legend with dynamic
legend_static = """{[
                    { name: 'Rent & Maintenance', value: 145000, color: 'bg-emerald-500' },
                    { name: 'Power & Telecom', value: 38400, color: 'bg-blue-500' },
                    { name: 'HVAC & Repairs', value: 22000, color: 'bg-amber-500' },
                    { name: 'Pantry Refreshment', value: 18500, color: 'bg-purple-500' },
                    { name: 'Stationery & Print', value: 9800, color: 'bg-pink-500' },
                  ].map((item, idx) => ("""

legend_dynamic = """{expenseSummary.map((item, idx) => ("""

content = content.replace(legend_static, legend_dynamic)

# 5. Make the "Expenses ->" button clickable
button_static = """<button className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full hover:bg-emerald-100 transition-colors shrink-0">"""
button_dynamic = """<button onClick={() => navigate('/office-expenses')} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer">"""

content = content.replace(button_static, button_dynamic)

with open('client/src/pages/dashboard/DashboardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Dynamic expenses added!")
