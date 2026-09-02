import re

with open('temp_schema_utf8.prisma', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = -1
end = -1
for i, l in enumerate(lines):
    if l.startswith('model User {'):
        start = i
    if l.startswith('model Department {'):
        end = i
        break

user_emp_code = "".join(lines[start:end])

# Add deactivatedAt, tokenVersion, createdModulePermissions to User
user_emp_code = user_emp_code.replace(
    '  assignedRequests      EmployeeRequest[]  @relation("RequestAssignee")\n',
    '  assignedRequests      EmployeeRequest[]  @relation("RequestAssignee")\n  createdModulePermissions ModulePermission[] @relation("PermissionCreator")\n  deactivatedAt         DateTime?\n  tokenVersion          Int       @default(0)\n'
)

# Add isActive, deactivatedAt to Employee
user_emp_code = user_emp_code.replace(
    '  status        EmployeeStatus @default(ACTIVE)\n',
    '  status        EmployeeStatus @default(ACTIVE)\n  isActive      Boolean        @default(true)\n  deactivatedAt DateTime?\n'
)

with open('server/prisma/schema.prisma', 'r', encoding='utf-8') as f:
    schema_lines = f.readlines()

new_schema = []
# We need to replace lines 254 to 270 (index 253 to 269) with user_emp_code
for i, l in enumerate(schema_lines):
    if 253 <= i <= 269:
        continue
    new_schema.append(l)
    if i == 252:
        new_schema.append(user_emp_code)

with open('server/prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.writelines(new_schema)

print("Fixed schema")
