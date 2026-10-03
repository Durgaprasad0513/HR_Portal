import re

with open('server/src/modules/employees/employee.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

create_patch = """    async create(currentUser: CurrentUser, data: CreateEmployeeInput, reqContext: { ipAddress?: string } = {}) {
      const createData: any = { ...data };

      const numericFields = ['salary', 'ctc', 'basicSalary', 'grossSalary', 'probationPeriod', 'noticePeriod'];
      for (const field of numericFields) {
        if (createData[field] === '') {
          createData[field] = null;
        } else if (createData[field] !== undefined && createData[field] !== null) {
          createData[field] = Number(createData[field]);
        }
      }
      if (createData.departmentId === '') createData.departmentId = null;
      if (createData.managerId === '') createData.managerId = null;

      const { dateOfBirth, joiningDate, ...restData } = createData;

      let employee;
      try {
        employee = await prisma.employee.create({
          data: {
            ...restData as any,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            joiningDate: new Date(joiningDate),
          },"""

content = re.sub(r'async create\(currentUser: CurrentUser, data: CreateEmployeeInput, reqContext: \{ ipAddress\?: string \} = \{\}\) \{\s*const \{ dateOfBirth, joiningDate, \.\.\.restData \} = data;\s*let employee;\s*try \{\s*employee = await prisma\.employee\.create\(\{\s*data: \{\s*\.\.\.restData as any,\s*dateOfBirth: dateOfBirth \? new Date\(dateOfBirth\) : undefined,\s*joiningDate: new Date\(joiningDate\),\s*\},', create_patch, content)

with open('server/src/modules/employees/employee.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("employee.service.ts create updated!")
