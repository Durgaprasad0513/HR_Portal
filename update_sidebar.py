import re

with open("client/src/components/layout/Sidebar.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("name: 'Employee Mgt'", "name: 'Employee'")
content = content.replace("name: 'Role Mgt'", "name: 'Role Management'")

with open("client/src/components/layout/Sidebar.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated Sidebar.tsx labels")
