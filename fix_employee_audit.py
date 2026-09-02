import re

path = "server/src/modules/employees/employee.service.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# First, remove the faulty injected code completely to revert to a clean state.
bad_code_create = """
    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_EMPLOYEE',
        moduleAffected: 'employees',
        recordIdAffected: employee.id,
        userId: currentUser.id,
        ipAddress: reqContext.ipAddress,
        newValue: JSON.stringify(data),
      }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPDATE_EMPLOYEE',
        moduleAffected: 'employees',
        recordIdAffected: employee.id,
        userId: currentUser.id,
        ipAddress: reqContext.ipAddress,
        newValue: JSON.stringify(updateData),
      }
    });"""
content = content.replace(bad_code_create, "")

# Now inject correctly into create
correct_audit_create = """
    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_EMPLOYEE',
        moduleAffected: 'employees',
        recordIdAffected: employee.id,
        userId: currentUser.id,
        ipAddress: reqContext.ipAddress,
        newValue: JSON.stringify(data),
      }
    });

    return employee;"""

# In create(), the end is:
#       include: {
#         department: { select: { id: true, name: true } },
#       },
#     });
#
#     return employee;
#   }
# We just replace the `return employee;` for `create` and `update` specifically.

# Using regex to target the specific methods:
create_method_match = re.search(r"async create\([\s\S]*?return employee;\n  \}", content)
if create_method_match:
    create_method = create_method_match.group(0)
    create_method = create_method.replace("return employee;\n  }", correct_audit_create + "\n  }")
    content = content.replace(create_method_match.group(0), create_method)

correct_audit_update = """
    await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPDATE_EMPLOYEE',
        moduleAffected: 'employees',
        recordIdAffected: employee.id,
        userId: currentUser.id,
        ipAddress: reqContext.ipAddress,
        newValue: JSON.stringify(updateData),
      }
    });

    return employee;"""

update_method_match = re.search(r"async update\([\s\S]*?return employee;\n  \}", content)
if update_method_match:
    update_method = update_method_match.group(0)
    update_method = update_method.replace("return employee;\n  }", correct_audit_update + "\n  }")
    content = content.replace(update_method_match.group(0), update_method)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
