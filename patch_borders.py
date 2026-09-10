import os

path = 'client/src/pages/roles/RoleManagementPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Table Container (User Accounts and Permissions Matrix)
content = content.replace('border-gray-200 dark:border-gray-800 overflow-hidden', 'border-slate-200 dark:border-slate-700 overflow-hidden')

# 2. Table Header Row (User Accounts)
content = content.replace('<thead className="bg-transparent dark:bg-transparent border-b border-gray-200 dark:border-gray-700">', '<thead className="bg-transparent dark:bg-transparent border-b border-slate-200 dark:border-slate-700">')

# 3. Table Body Divider (User Accounts)
content = content.replace('divide-gray-200 dark:divide-gray-700', 'divide-slate-100 dark:divide-slate-700')

# 4. Table Row Hover (User Accounts)
content = content.replace('hover:bg-gray-50 dark:hover:bg-gray-800/50', 'hover:bg-slate-50 dark:hover:bg-slate-800/50')

# Permissions Matrix might also have some borders to fix
# Let's fix the header border
content = content.replace('border-gray-200 dark:border-gray-700', 'border-slate-200 dark:border-slate-700')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Matched borders to Assets DataTable")
