import re

with open("client/src/pages/employees/EmployeeFormPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

conflict_pattern = r"<<<<<<< HEAD\n.*?\n=======\n(.*?)\n>>>>>>> [a-f0-9]+"

content = re.sub(conflict_pattern, r"\1", content, flags=re.DOTALL)

with open("client/src/pages/employees/EmployeeFormPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Resolved conflicts in EmployeeFormPage")
