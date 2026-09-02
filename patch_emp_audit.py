import re

with open("server/src/modules/employees/employee.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Patch the update method to capture old/new value diff
old_pattern = """  async update(currentUser: CurrentUser, id: string, data: UpdateEmployeeInput, reqContext: { ipAddress?: string } = {}) {"""

new_pattern = """  async update(currentUser: CurrentUser, id: string, data: UpdateEmployeeInput, reqContext: { ipAddress?: string } = {}) {
    // Capture state before update for audit diff
    const beforeUpdate = await prisma.employee.findUnique({ where: { id } });"""

content = content.replace(old_pattern, new_pattern)

# Now patch the auditLog.create in update to include oldValue/newValue
old_audit = """        await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPDATE_EMPLOYEE',
        moduleAffected: 'employees',
        recordIdAffected: employee.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });"""

new_audit = """        // Build diff of changed fields
        const changedOld: any = {};
        const changedNew: any = {};
        if (beforeUpdate) {
          for (const key of Object.keys(data as any)) {
            const k = key as keyof typeof beforeUpdate;
            if (beforeUpdate[k] !== (employee as any)[k]) {
              changedOld[k] = beforeUpdate[k];
              changedNew[k] = (employee as any)[k];
            }
          }
        }

        await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPDATE_EMPLOYEE',
        moduleAffected: 'employees',
        recordIdAffected: employee.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
        oldValue: Object.keys(changedOld).length > 0 ? JSON.stringify(changedOld) : undefined,
        newValue: Object.keys(changedNew).length > 0 ? JSON.stringify(changedNew) : undefined,
      }
    });"""

content = content.replace(old_audit, new_audit)

with open("server/src/modules/employees/employee.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated employee.service.ts with diff capture")
