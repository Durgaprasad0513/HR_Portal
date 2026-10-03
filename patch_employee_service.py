import re

with open('server/src/modules/employees/employee.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# For UPDATE
update_patch = """    const updateData: any = { ...data };

    const numericFields = ['salary', 'ctc', 'basicSalary', 'grossSalary', 'probationPeriod', 'noticePeriod'];
    for (const field of numericFields) {
      if (updateData[field] === '') {
        updateData[field] = null;
      } else if (updateData[field] !== undefined && updateData[field] !== null) {
        updateData[field] = Number(updateData[field]);
      }
    }
    
    if (updateData.departmentId === '') updateData.departmentId = null;

    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }
    if (data.joiningDate) {
      updateData.joiningDate = new Date(data.joiningDate);
    }
    if (data.managerId !== undefined) {
      updateData.managerId = data.managerId || null;
    }"""

content = re.sub(r'const updateData: any = \{ \.\.\.data \};\s*if \(data\.dateOfBirth\).*?updateData\.managerId = data\.managerId \|\| null;\s*\}', update_patch.strip(), content, flags=re.DOTALL)


# For CREATE
create_patch = """    const createData: any = { ...data };

    const numericFields = ['salary', 'ctc', 'basicSalary', 'grossSalary', 'probationPeriod', 'noticePeriod'];
    for (const field of numericFields) {
      if (createData[field] === '') {
        createData[field] = null;
      } else if (createData[field] !== undefined && createData[field] !== null) {
        createData[field] = Number(createData[field]);
      }
    }
    
    if (createData.departmentId === '') createData.departmentId = null;

    if (data.dateOfBirth) {
      createData.dateOfBirth = new Date(data.dateOfBirth);
    }
    if (data.joiningDate) {
      createData.joiningDate = new Date(data.joiningDate);
    }
    if (data.managerId !== undefined) {
      createData.managerId = data.managerId || null;
    }"""

content = re.sub(r'const createData: any = \{ \.\.\.data \};\s*if \(data\.dateOfBirth\).*?createData\.managerId = data\.managerId \|\| null;\s*\}', create_patch.strip(), content, flags=re.DOTALL)

with open('server/src/modules/employees/employee.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("employee.service.ts updated!")
