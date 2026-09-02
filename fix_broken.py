import os

with open('client/src/components/layout/Header.tsx', 'r') as f:
    content = f.read()
    
content = content.replace('{user?.employee?.firstName ? ${user.employee.firstName}  : user?.email}', '{user?.employee?.firstName ? `${user.employee.firstName} ${user.employee.lastName}` : user?.email}')
with open('client/src/components/layout/Header.tsx', 'w') as f:
    f.write(content)

with open('client/src/pages/travel/TravelListPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("accessor: (row: any) => ${row.employee.firstName} ,", "accessor: (row: any) => `${row.employee.firstName} ${row.employee.lastName}`,")
content = content.replace("accessor: (row: any) => ${new Date(row.startDate).toLocaleDateString()} - ,", "accessor: (row: any) => `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}`,")

with open('client/src/pages/travel/TravelListPage.tsx', 'w') as f:
    f.write(content)
print('Done!')
