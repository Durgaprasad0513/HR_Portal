import re

with open("client/src/pages/attrition/AttritionDashboardPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'dataKey="count"',
    'dataKey="count"\n                  nameKey="name"'
)

with open("client/src/pages/attrition/AttritionDashboardPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated nameKey")
