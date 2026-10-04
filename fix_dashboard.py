import re
with open('client/src/pages/dashboard/DashboardPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('Hyderabad Corporate HQ Expenses', 'Office Expenses')
content = content.replace('?' + Number(value)', '₹' + Number(value)')
content = content.replace('?{item.value', '₹{item.value')
content = content.replace('return finalData.filter(item => item.value > 0);', 'return finalData;')

with open('client/src/pages/dashboard/DashboardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
