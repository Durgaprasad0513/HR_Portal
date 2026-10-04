import re

with open('client/src/pages/dashboard/DashboardPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

expenses_chart = """            {/* Office Expenses Chart */}
            <div className="bg-surface rounded-xl shadow-sm border border-slate-border p-5 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-text-heading text-sm uppercase tracking-wider">Hyderabad Corporate HQ Expenses</h3>
                  <p className="text-xs text-text-muted mt-1">Expense distribution across operational cost centers</p>
                </div>
                <button className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full hover:bg-emerald-100 transition-colors shrink-0">
                  Expenses <ArrowRight size={12} />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-6 xl:gap-8 w-full mt-4">
                <div className="w-56 h-56 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
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
                      </Pie>
                      <Tooltip 
                        formatter={(value) => '?' + value.toLocaleString('en-IN')}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-col gap-4 flex-1 w-full max-w-xs justify-center">
                  {[
                    { name: 'Rent & Maintenance', value: 145000, color: 'bg-emerald-500' },
                    { name: 'Power & Telecom', value: 38400, color: 'bg-blue-500' },
                    { name: 'HVAC & Repairs', value: 22000, color: 'bg-amber-500' },
                    { name: 'Pantry Refreshment', value: 18500, color: 'bg-purple-500' },
                    { name: 'Stationery & Print', value: 9800, color: 'bg-pink-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className={'w-3 h-3 rounded-full ' + item.color}></div>
                        <span className="text-text-muted font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-text-heading">?{item.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>"""

regex = r"\{\/\*\s*Quick Actions\s*\*\/\}.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>"
new_content = re.sub(regex, expenses_chart + "\n    </div>\n", content, flags=re.DOTALL)

if 'PieChart' not in new_content:
    new_content = new_content.replace("AreaChart, Area, BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer", 
                              "AreaChart, Area, BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell")

with open('client/src/pages/dashboard/DashboardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Regex replace run")
