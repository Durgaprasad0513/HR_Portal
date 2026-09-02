import re

with open("server/src/modules/employees/employee.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r"documents: true,?\s*}", "documents: true,\n          assignedAssets: true,\n        }", content)

with open("server/src/modules/employees/employee.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Added assignedAssets to employee.service.ts")
