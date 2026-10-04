import re

with open('client/src/pages/dashboard/components/EmployeeDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('{/* ROW 2:')
end_idx = content.rfind('</div>\n    </div>\n  );\n}')

new_row2 = """{/* ROW 2: 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Needs Attention */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-heading text-lg">Needs Attention</h3>
          </div>
          <div className="bg-surface rounded-xl border border-slate-border shadow-sm overflow-hidden flex-1 flex flex-col">
            {statsData?.needsAttention?.length > 0 ? (
              <div className="divide-y divide-slate-border flex-1">
                {statsData.needsAttention.slice(0, 4).map((item: any) => (
                  <Link key={item.id} to={item.link} className="flex flex-col gap-1 p-4 hover:bg-tint transition-colors group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">{item.module}</span>
                      {item.dueDate && <span className="text-xs font-medium text-rose-500">Due {formatDate(item.dueDate)}</span>}
                    </div>
                    <p className="text-sm font-semibold text-text-heading group-hover:text-accent-700 transition-colors line-clamp-1">{item.title}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="font-medium text-text-heading mb-1">All caught up!</p>
                <p className="text-xs text-text-muted">No pending tasks.</p>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: My Recent Leaves */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-heading text-lg">My Recent Leaves</h3>
            <Link to="/leaves" className="text-sm font-semibold text-brand-primary hover:underline">View All</Link>
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
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{month}</span>
                        <span className="text-sm font-bold text-text-heading">{dateNum}</span>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-text-heading line-clamp-1">{leave.leaveType?.replace('_', ' ') || leave.leaveType}</p>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{leave.days} day(s) &bull; {leave.reason}</p>
                      </div>
                    </div>
                    <div className={clsx("flex items-center justify-center w-8 h-8 rounded-full shrink-0", getStatusColor(leave.status))}>
                      {getStatusIcon(leave.status)}
                    </div>
                  </div>
                )})}
              </div>
            ) : (
              <div className="p-10 text-center flex flex-col items-center justify-center text-slate-400 flex-1">
                <Calendar className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-medium text-text-heading mb-1">No recent leaves</p>
                <p className="text-xs">You haven't taken any time off recently.</p>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Recent Requests */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-heading text-lg">Recent Requests</h3>
          </div>
          <div className="bg-surface rounded-xl border border-slate-border shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="divide-y divide-slate-border flex-1">
              <div className="p-4 flex items-center justify-between hover:bg-tint transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                     <Receipt size={18} />
                   </div>
                   <div>
                     <p className="font-bold text-sm text-text-heading">Client Lunch</p>
                     <p className="text-xs text-text-muted mt-0.5">Office Expenses</p>
                   </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold text-amber-600 bg-amber-50 border-amber-200">
                  <Clock className="w-3.5 h-3.5" /> Pending
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-tint transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                     <Plane size={18} />
                   </div>
                   <div>
                     <p className="font-bold text-sm text-text-heading">Delhi Conference</p>
                     <p className="text-xs text-text-muted mt-0.5">Travel Request</p>
                   </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold text-emerald-600 bg-emerald-50 border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5" /> Approved
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-tint transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                     <Laptop size={18} />
                   </div>
                   <div>
                     <p className="font-bold text-sm text-text-heading">Broken Mouse</p>
                     <p className="text-xs text-text-muted mt-0.5">IT Helpdesk</p>
                   </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold text-amber-600 bg-amber-50 border-amber-200">
                  <Clock className="w-3.5 h-3.5" /> In Progress
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>"""

new_content = content[:start_idx] + new_row2 + content[end_idx:]

with open('client/src/pages/dashboard/components/EmployeeDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated Row 2 layout")
