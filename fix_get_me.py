import re

with open("server/src/modules/auth/auth.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("role: true,", "role: true,\n        employeeId: true,")

with open("server/src/modules/auth/auth.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Added employeeId to getMe")
