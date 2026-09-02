import re

with open('client/src/pages/travel/TravelListPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("accessor: (row: any) => \\\\ \\\\,", "accessor: (row: any) => ${row.employee.firstName} ,")
content = content.replace("accessor: (row: any) => \\\\ - \\\\,", "accessor: (row: any) => ${new Date(row.startDate).toLocaleDateString()} - ,")

with open('client/src/pages/travel/TravelListPage.tsx', 'w') as f:
    f.write(content)
print('Done!')
