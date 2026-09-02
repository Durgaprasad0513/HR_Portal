import re

with open("server/src/modules/employees/employee.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if "import { notificationService }" not in content:
    content = content.replace("import prisma from '../../config/database';", "import prisma from '../../config/database';\nimport { notificationService } from '../notifications/notification.service';")

# 1. createEmployee
create_hook = """    // Notify HRs about new joining
    await notificationService.notifyHRs({
      notificationType: 'JOINING',
      message: `New employee joined: ${employee.firstName} ${employee.lastName}`,
      triggerEvent: employee.id
    });

    return employee;"""
content = content.replace("return employee;", create_hook, 1)

# 2. updateEmployee (RESIGNATION)
update_hook = """    if (data.status === 'RESIGNED') {
      await notificationService.notifyHRs({
        notificationType: 'RESIGNATION',
        message: `Employee resigned: ${employee.firstName} ${employee.lastName}`,
        triggerEvent: employee.id
      });
    }

    return employee;"""

# replace the return in updateEmployee
# since return employee; occurs multiple times, we need a smarter replace for updateEmployee
old_update = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPDATE_EMPLOYEE',
        moduleAffected: 'employees',
        recordIdAffected: employee.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return employee;"""

new_update = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPDATE_EMPLOYEE',
        moduleAffected: 'employees',
        recordIdAffected: employee.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

""" + update_hook

content = content.replace(old_update, new_update)

with open("server/src/modules/employees/employee.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated employee.service.ts")
