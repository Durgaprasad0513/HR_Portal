import re
import os

filepath = 'client/src/pages/dashboard/DashboardPage.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Modal import if missing
if 'import { Modal } from' not in content:
    content = content.replace(
        "import { BoxReveal } from '@/components/ui/modern-animated-sign-in';",
        "import { BoxReveal } from '@/components/ui/modern-animated-sign-in';\nimport { Modal } from '@/components/ui/Modal';"
    )

old_card = '''   {/* Active Employees / Today's Attendance */}
   <div className="relative bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-md transition-all">
   <div className="flex justify-between items-start mb-4">
   <div>
   <p className="text-sm font-medium text-text-muted mb-1">Active employees</p>
   <h3 className="text-3xl font-bold text-text-heading">{headline.activeEmployees || 0}</h3>
   </div>
   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
   <Users className="w-5 h-5" />
   </div>
   </div>
  
   {/* Today's Attendance Bar */}
   <div className="mt-1 mb-3">
   <div className="flex items-center justify-between text-xs font-medium mb-1.5">
   <span className="text-emerald-600">Present today: {headline.presentToday ?? headline.activeEmployees ?? 0}</span>
   <button
   onClick={() => setShowAbsent(v => !v)}
   className="text-rose-600 hover:underline focus:outline-none"
   >
   Absent: {headline.absentToday ?? 0}
   </button>
   </div>
   {(headline.activeEmployees ?? 0) > 0 && (
   <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
   <div
   className="h-full rounded-full bg-emerald-500 transition-all"
   style={{ width: `${Math.round(((headline.presentToday ?? headline.activeEmployees ?? 0) / headline.activeEmployees) * 100)}%` }}
   />
   </div>
   )}
   </div>
  
  
  
   {/* Absent list dropdown */}
   {showAbsent && (stats.absentEmployeesList?.length ?? 0) > 0 && (
   <div className="absolute top-full left-0 mt-2 w-64 bg-surface rounded-xl shadow-xl border border-slate-border z-50 overflow-hidden">
   <div className="p-3 bg-rose-50 dark:bg-rose-900/20 border-b border-slate-border">
   <p className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">On Leave Today</p>
   </div>
   <div className="max-h-56 overflow-y-auto divide-y divide-slate-border">
   {(stats.absentEmployeesList || []).map((emp: any) => (
   <div key={emp.id} className="px-4 py-2.5 flex items-center gap-2.5">
   <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-700 dark:text-rose-400 text-xs font-bold uppercase shrink-0">
   {emp.name.charAt(0)}
   </div>
   <div>
   <p className="text-xs font-semibold text-text-heading leading-tight">{emp.name}</p>
   <p className="text-[10px] text-text-muted">{emp.department || 'No Dept'}</p>
   </div>
   </div>
   ))}
   </div>
   </div>
   )}
   </div>'''

new_card = '''   {/* Active Employees / Today's Attendance */}
   <div 
     onClick={() => navigate('/employees')}
     className="relative bg-surface rounded-xl shadow-sm border border-slate-border p-5 hover:shadow-md hover:border-brand-primary/50 cursor-pointer transition-all group"
   >
     <div className="flex justify-between items-start mb-4">
       <div>
         <p className="text-sm font-medium text-text-muted mb-1 group-hover:text-brand-primary transition-colors">Active employees</p>
         <h3 className="text-3xl font-bold text-text-heading">{headline.activeEmployees || 0}</h3>
       </div>
       <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
         <Users className="w-5 h-5" />
       </div>
     </div>
  
     {/* Today's Attendance Bar */}
     <div className="mt-1 mb-3">
       <div className="flex items-center justify-between text-xs font-medium mb-1.5">
         <span className="text-emerald-600">Present today: {headline.presentToday ?? headline.activeEmployees ?? 0}</span>
         <button
           onClick={(e) => {
             e.stopPropagation();
             setShowAbsent(true);
           }}
           className="text-rose-600 hover:underline focus:outline-none z-10 relative"
         >
           Absent: {headline.absentToday ?? 0}
         </button>
       </div>
       {(headline.activeEmployees ?? 0) > 0 && (
         <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
           <div
             className="h-full rounded-full bg-emerald-500 transition-all"
             style={{ width: `${Math.round(((headline.presentToday ?? headline.activeEmployees ?? 0) / headline.activeEmployees) * 100)}%` }}
           />
         </div>
       )}
     </div>
   </div>

   {/* Absent list modal */}
   <Modal 
     isOpen={showAbsent} 
     onClose={() => setShowAbsent(false)} 
     title={`On Leave Today (${headline.absentToday ?? 0})`}
   >
     <div className="max-h-80 overflow-y-auto divide-y divide-slate-border -mx-5 -mb-5 px-5 pb-5">
       {(stats?.absentEmployeesList?.length ?? 0) === 0 ? (
         <div className="py-8 text-center text-sm text-slate-500">
           No employees are absent today.
         </div>
       ) : (
         (stats.absentEmployeesList || []).map((emp: any) => (
           <div key={emp.id} className="py-3 flex items-center gap-3">
             <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-700 dark:text-rose-400 text-sm font-bold uppercase shrink-0">
               {emp.name.charAt(0)}
             </div>
             <div>
               <p className="text-sm font-semibold text-text-heading leading-tight">{emp.name}</p>
               <p className="text-xs text-text-muted mt-0.5">{emp.department || 'No Department'}</p>
             </div>
           </div>
         ))
       )}
     </div>
   </Modal>'''

# Because whitespace might differ, we can do a regex replacement or just string replacement if exact
import textwrap

# Let's write a flexible regex to replace everything between {/* Active Employees / Today's Attendance */} and </div>
# Wait, there are multiple </div>s.
# Let's just use string slicing based on markers.
start_marker = "{/* Active Employees / Today's Attendance */}"
end_marker = "   {/* Employee Attrition */}"

if start_marker in content and end_marker in content:
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    new_content = content[:start_idx] + new_card + "\n\n" + content[end_idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully replaced the card.")
else:
    print("Markers not found.")
