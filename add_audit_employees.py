import re

# Update employee.controller.ts
path = "server/src/modules/employees/employee.controller.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("await employeeService.create(payload as any);", "await employeeService.create(req.user! as any, payload as any, { ipAddress: req.ip });")
content = content.replace("await employeeService.update(req.params.id as string, payload as any);", "await employeeService.update(req.user! as any, req.params.id as string, payload as any, { ipAddress: req.ip });")
content = content.replace("await employeeService.delete(req.params.id as string);", "await employeeService.delete(req.user! as any, req.params.id as string, { ipAddress: req.ip });")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Update employee.service.ts
path = "server/src/modules/employees/employee.service.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("async create(data: CreateEmployeeInput) {", "async create(currentUser: CurrentUser, data: CreateEmployeeInput, reqContext: { ipAddress?: string } = {}) {")
content = content.replace("async update(id: string, data: UpdateEmployeeInput) {", "async update(currentUser: CurrentUser, id: string, data: UpdateEmployeeInput, reqContext: { ipAddress?: string } = {}) {")
content = content.replace("async delete(id: string) {", "async delete(currentUser: CurrentUser, id: string, reqContext: { ipAddress?: string } = {}) {")

# Add audit hooks
audit_create = """    });

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
content = re.sub(r"    \}\);\n\n    return employee;", audit_create, content, count=1)

audit_update = """    });

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
content = re.sub(r"    \}\);\n\n    return employee;", audit_update, content, count=1)

audit_delete = """    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'DEACTIVATE_EMPLOYEE',
        moduleAffected: 'employees',
        recordIdAffected: id,
        userId: currentUser.id,
        ipAddress: reqContext.ipAddress,
      }
    });
  }"""
content = re.sub(r"    \}\);\n  \}", audit_delete, content, count=1)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
