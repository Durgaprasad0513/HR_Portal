import re
with open('server/prisma/schema.prisma', 'r') as f:
    content = f.read()

# Add isActive back to User
user_addition = """
  isActive          Boolean       @default(true)
  deactivatedAt     DateTime?
  tokenVersion      Int           @default(0)
"""
content = re.sub(r'(model User \{[^}]+)(employeeId\s+String\?)', r'\1' + user_addition + r'\2', content)

# Add isActive back to Employee
employee_addition = """
  isActive          Boolean       @default(true)
"""
# Employee already has deactivatedAt because I didn't delete it
content = re.sub(r'(model Employee \{[^}]+)(departmentId\s+String\?)', r'\1' + employee_addition + r'\2', content)

with open('server/prisma/schema.prisma', 'w') as f:
    f.write(content)
print('Done!')
