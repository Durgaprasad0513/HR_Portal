with open('client/src/pages/dashboard/DashboardPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const sums = {", "const sums: Record<string, number> = {")

with open('client/src/pages/dashboard/DashboardPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
