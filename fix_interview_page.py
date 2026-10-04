import re

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the stats array definition
stats_regex = r"// Mock stats\s*const stats = \[.*?\];\s*"
content = re.sub(stats_regex, "", content, flags=re.DOTALL)

# 2. Replace the Header Section and Stats Cards with a standard PageHeader
header_and_stats_regex = r"\{/\* Header Section \*/\}.*?\{/\* Content Area \*/\}"

page_header = """<PageHeader
        title="Interview Calendar"
        description="Coordinate panel interviews, technical rounds, video meeting links, and track scoring outcomes all in one place."
        actions={
          <div className="flex gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
              <button 
                onClick={() => setViewMode('calendar')} 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-surface shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                Calendar View
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'list' ? 'bg-white dark:bg-surface shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              >
                List View
              </button>
            </div>
            <Button onClick={() => setIsScheduleModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Schedule Interview
            </Button>
          </div>
        }
      />

      {/* Content Area */}"""

content = re.sub(header_and_stats_regex, page_header, content, flags=re.DOTALL)

# 3. Fix the wrapper div class (from space-y-6 animate-in... max-w-7xl... to space-y-6)
# Actually, standard pages just use <div className="space-y-6">
wrapper_regex = r"<div className=\"space-y-6 animate-in fade-in max-w-7xl mx-auto pb-10\">"
content = content.replace(wrapper_regex, '<div className="space-y-6">')

# 4. Fix Content Area card style to standard
# The current one: className="bg-white dark:bg-surface rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden min-h-[400px]"
card_regex = r"<div className=\"bg-white dark:bg-surface rounded-\[2rem\] shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden min-h-\[400px\]\">"
standard_card = '<div className="bg-surface rounded-xl shadow-sm border border-slate-border overflow-hidden min-h-[400px]">'
content = content.replace(card_regex, standard_card)

# 5. Fix table header styles
# The current one: className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700"
thead_regex = r"<thead className=\"bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700\">"
standard_thead = '<thead className="bg-tint border-b border-slate-border">'
content = content.replace(thead_regex, standard_thead)

# The table th cells currently have text-slate-500 dark:text-slate-400. Let's make them text-text-muted
th_regex = r"px-6 py-4 font-bold uppercase tracking-wider text-xs text-slate-500 dark:text-slate-400"
standard_th = 'px-6 py-4 font-bold uppercase tracking-wider text-xs text-text-muted'
content = content.replace(th_regex, standard_th)

# 6. Fix divide-y styles
# Current: divide-y divide-slate-100 dark:divide-slate-800
divide_regex = r"divide-y divide-slate-100 dark:divide-slate-800"
standard_divide = 'divide-y divide-slate-border'
content = content.replace(divide_regex, standard_divide)

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated InterviewCalendarPage.tsx")
