import re

with open("server/src/modules/employees/employee.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add imports if they don't exist
if "import crypto from 'crypto';" not in content:
    content = content.replace("import prisma from '../../config/database';", "import prisma from '../../config/database';\nimport crypto from 'crypto';\nimport { hashPassword } from '../../utils/password';")

old_create_return = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_EMPLOYEE',
        moduleAffected: 'employees',
        recordIdAffected: employee.id,
        userId: currentUser.id,
        ipAddress: reqContext.ipAddress,
        newValue: JSON.stringify(data),
      }
    });

    return employee;
  }"""

new_create_return = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_EMPLOYEE',
        moduleAffected: 'employees',
        recordIdAffected: employee.id,
        userId: currentUser.id,
        ipAddress: reqContext.ipAddress,
        newValue: JSON.stringify(data),
      }
    });

    // Generate a secure temporary password
    const temporaryPassword = crypto.randomBytes(4).toString('hex') + 'aA1!'; 
    const hashedPassword = await hashPassword(temporaryPassword);

    // Create the associated User account
    await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: 'EMPLOYEE', // Default role
        employeeId: employee.id,
      }
    });

    return { employee, temporaryPassword };
  }"""

content = content.replace(old_create_return, new_create_return)

with open("server/src/modules/employees/employee.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched employee.service.ts")
