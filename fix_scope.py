import re

path = "server/src/modules/employees/employee.service.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix getById
getById_replacement = """    const employee = await prisma.employee.findFirst({
      where: {
        AND: [
          { id },
          { isActive: true },
          scopeQuery
        ]
      },"""
content = re.sub(r"    const employee = await prisma\.employee\.findFirst\(\{\s*where: \{\s*id,\s*isActive: true,\s*\.\.\.scopeQuery\s*\},", getById_replacement, content)

# Fix getDashboardStats
getDashboardStats_replacement = """    const baseWhere = {
      AND: [
        { isActive: true },
        scopeQuery
      ]
    };"""
content = re.sub(r"    const baseWhere = \{\s*\.\.\.scopeQuery,\s*isActive: true\s*\};", getDashboardStats_replacement, content)

# Fix getAll
# Because baseWhere might add OR/departmentId, it's safer to just wrap the whole thing inside AND.
getAll_replacement = """    const baseWhere: Prisma.EmployeeWhereInput = {
      AND: [
        { isActive: true },
        scopeQuery
      ]
    };"""
content = re.sub(r"    const baseWhere: Prisma\.EmployeeWhereInput = \{\s*\.\.\.scopeQuery,\s*isActive: true // Filter out deactivated logic\s*\};", getAll_replacement, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
