import re

with open('client/src/components/ui/Calendar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add new imports
new_imports = """import {
 format,
 addMonths,
 subMonths,
 startOfMonth,
 endOfMonth,
 startOfWeek,
 endOfWeek,
 isSameMonth,
 isSameDay,
 addDays,
 isToday,
 getYear,
 getMonth,
 setYear,
 setMonth
} from 'date-fns';"""

content = re.sub(r"import \{\s*format,.*?\} from 'date-fns';", new_imports, content, flags=re.DOTALL)

old_render_header = """ const renderHeader = () => {
 return (
 <div className="flex justify-between items-center mb-4">
 <Button
 variant="ghost"
 type="button"
 onClick={prevMonth}
 className="h-8 w-8 p-0 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
 >
 <ChevronLeft className="h-4 w-4" />
 </Button>
 <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
 {format(currentMonth, 'MMMM yyyy')}
 </div>
 <Button
 variant="ghost"
 type="button"
 onClick={nextMonth}
 className="h-8 w-8 p-0 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
 >
 <ChevronRight className="h-4 w-4" />
 </Button>
 </div>
 );
 };"""

new_render_header = """ const renderHeader = () => {
 const currentYear = getYear(currentMonth);
 const currentMonthValue = getMonth(currentMonth);

 const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
 setCurrentMonth(setYear(currentMonth, parseInt(e.target.value)));
 };

 const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
 setCurrentMonth(setMonth(currentMonth, parseInt(e.target.value)));
 };

 const years = [];
 for (let i = 1950; i <= new Date().getFullYear() + 20; i++) {
 years.push(i);
 }
 
 const months = [
 'January', 'February', 'March', 'April', 'May', 'June',
 'July', 'August', 'September', 'October', 'November', 'December'
 ];

 return (
 <div className="flex justify-between items-center mb-4">
 <Button
 variant="ghost"
 type="button"
 onClick={prevMonth}
 className="h-8 w-8 p-0 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 shrink-0"
 >
 <ChevronLeft className="h-4 w-4" />
 </Button>
 
 <div className="flex gap-1 font-semibold text-sm text-slate-900 dark:text-slate-100 items-center justify-center flex-1">
 <select 
 value={currentMonthValue} 
 onChange={handleMonthChange}
 className="bg-transparent border-none focus:ring-0 cursor-pointer outline-none hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-1 py-1 text-sm font-semibold appearance-none text-center"
 style={{ backgroundImage: 'none' }}
 >
 {months.map((m, idx) => <option key={m} value={idx} className="text-slate-900 dark:bg-gray-800 dark:text-white">{m}</option>)}
 </select>
 
 <select 
 value={currentYear} 
 onChange={handleYearChange}
 className="bg-transparent border-none focus:ring-0 cursor-pointer outline-none hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-1 py-1 text-sm font-semibold appearance-none text-center"
 style={{ backgroundImage: 'none' }}
 >
 {years.map(y => <option key={y} value={y} className="text-slate-900 dark:bg-gray-800 dark:text-white">{y}</option>)}
 </select>
 </div>
 
 <Button
 variant="ghost"
 type="button"
 onClick={nextMonth}
 className="h-8 w-8 p-0 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 shrink-0"
 >
 <ChevronRight className="h-4 w-4" />
 </Button>
 </div>
 );
 };"""

if old_render_header in content:
    content = content.replace(old_render_header, new_render_header)
else:
    print("WARNING: old_render_header not found directly. using regex.")
    content = re.sub(r" const renderHeader = \(\) => \{.*?\n \};\n", new_render_header + "\n", content, flags=re.DOTALL)

with open('client/src/components/ui/Calendar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
