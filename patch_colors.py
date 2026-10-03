import re

with open('client/src/pages/requests/RequestListPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Send Button
content = content.replace('bg-primary-600 hover:bg-primary-700', 'bg-brand-primary hover:bg-brand-hover')

# Active ticket state in left pane
content = content.replace("border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/10", "border-l-brand-primary bg-brand-primary/10 dark:bg-brand-primary/20")

# Left pane icon color
content = content.replace('text-primary-600', 'text-brand-primary')
content = content.replace('dark:text-primary-400', 'dark:text-brand-primary')

# Right pane response bubbles
content = content.replace('bg-primary-50 dark:bg-primary-900/20', 'bg-brand-primary/10 dark:bg-brand-primary/20')
content = content.replace('border-primary-100 dark:border-primary-800/50', 'border-brand-primary/20 dark:border-brand-primary/30')
content = content.replace('text-primary-800', 'text-brand-primary')
content = content.replace('text-primary-600/70', 'text-brand-primary/80')
content = content.replace('bg-primary-200 dark:bg-primary-800', 'bg-brand-primary/20 dark:bg-brand-primary/30')
content = content.replace('text-primary-900 dark:text-primary-100', 'text-slate-900 dark:text-slate-100')

with open('client/src/pages/requests/RequestListPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("DONE")
