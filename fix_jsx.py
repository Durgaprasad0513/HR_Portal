import re

with open("client/src/pages/employees/EmployeeListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '<div className="border-b border-gray-200 dark:border-gray-700 pb-4" flex justify-between items-center">',
    '<div className="border-b border-gray-200 dark:border-gray-700 pb-4 flex justify-between items-center">'
)

with open("client/src/pages/employees/EmployeeListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed JSX syntax")
