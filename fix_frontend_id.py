import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("row.assignedEmployee?.id === user?.employeeId", "row.assignedEmployee?.id === (user?.employeeId || user?.employee?.id)")

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
