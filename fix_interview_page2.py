import re

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 3. Fix the wrapper div class 
wrapper_regex = r'<div className="space-y-6 animate-in fade-in max-w-7xl mx-auto pb-10">'
content = content.replace(wrapper_regex, '<div className="space-y-6">')

# 4. Fix Content Area card style to standard
card_regex = r'<div className="bg-white dark:bg-surface rounded-\[2rem\] shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden min-h-\[400px\]">'
standard_card = '<div className="bg-surface rounded-xl shadow-sm border border-slate-border overflow-hidden min-h-[400px]">'
content = re.sub(card_regex, standard_card, content)

# 5. Fix table header styles
thead_regex = r'<thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">'
standard_thead = '<thead className="bg-tint border-b border-slate-border">'
content = content.replace(thead_regex, standard_thead)

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated InterviewCalendarPage.tsx second pass")
