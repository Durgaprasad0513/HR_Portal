import re

with open('client/src/pages/policies/PolicyListPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_block = ''' <div className="relative w-full sm:w-80">
 <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
 <input 
 aria-label="Search documents"
 placeholder="Search policy name or summary..." 
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-9 pr-4 py-2 bg-surface border border-slate-border shadow-sm rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white"
 />
 </div>
 <select
 aria-label="Filter by category"
 value={categoryFilter}
 onChange={(e) => setCategoryFilter(e.target.value)}
 className="w-full sm:w-48 py-2 px-3 bg-surface border border-slate-border shadow-sm rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-slate-700 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700"
 >
 <option value="ALL">All Categories</option>
 {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
 </select>'''

new_block = ''' <div className="relative w-full sm:w-80">
 <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400 dark:text-gray-500 z-10" />
 <Input 
 aria-label="Search documents"
 placeholder="Search policy name or summary..." 
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="pl-10"
 />
 </div>
 <div className="w-full sm:w-64">
 <Select
 aria-label="Filter by category"
 value={categoryFilter}
 onChange={(e) => setCategoryFilter(e.target.value)}
 >
 <option value="ALL">All Categories</option>
 {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
 </Select>
 </div>'''

if old_block in content:
    content = content.replace(old_block, new_block)
    with open('client/src/pages/policies/PolicyListPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED TO MATCH")
