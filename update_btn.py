import re

with open("client/src/pages/employees/EmployeeListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'(<div className="border-b border-gray-200 dark:border-gray-700 pb-4")>\s*(<h1 className="text-2xl font-bold tracking-tight text-navy-900 dark:text-white">Employee Management</h1>)\s*(</div>)'

replacement = r'''\1 flex justify-between items-center">
          \2
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Export Register
          </Button>
        \3'''

content = re.sub(pattern, replacement, content)

with open("client/src/pages/employees/EmployeeListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated header successfully")
