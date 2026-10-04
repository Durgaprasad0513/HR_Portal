import re
with open('client/src/pages/dashboard/DashboardPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("formatter={(value) => '?' + value.toLocaleString('en-IN')}", "formatter={(value: any) => '?' + Number(value).toLocaleString('en-IN')}")

with open('client/src/pages/dashboard/DashboardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
