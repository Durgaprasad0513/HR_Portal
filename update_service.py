import re

with open("server/src/modules/employees/employee.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add assignedAssets to getById
old_include = """        include: {
        department: { select: { id: true, name: true } },
        manager: { select: { id: true, firstName: true, lastName: true } },
        subordinates: { select: { id: true, firstName: true, lastName: true, designation: true } },
        user: { select: { id: true, email: true, role: true, isActive: true } },
        documents: true,
      },"""

new_include = """        include: {
        department: { select: { id: true, name: true } },
        manager: { select: { id: true, firstName: true, lastName: true } },
        subordinates: { select: { id: true, firstName: true, lastName: true, designation: true } },
        user: { select: { id: true, email: true, role: true, isActive: true } },
        documents: true,
        assignedAssets: true,
      },"""

content = content.replace(old_include, new_include)

with open("server/src/modules/employees/employee.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated employee.service.ts")
