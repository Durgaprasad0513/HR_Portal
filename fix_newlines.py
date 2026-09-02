import re

with open("client/src/pages/employees/EmployeeListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace actual newlines inside quotes
content = content.replace('Status\n"', 'Status\\n"')
content = content.replace('.join("\n");', '.join("\\n");')

with open("client/src/pages/employees/EmployeeListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed newlines in string literals")
