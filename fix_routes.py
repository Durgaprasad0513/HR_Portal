import re

with open("client/src/routes/AppRoutes.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("<Route path=\"/profile\" element={<Navigate to=\"/settings\" replace />} />", "<Route path=\"/profile\" element={<Navigate to=\"/roles\" replace />} />")

with open("client/src/routes/AppRoutes.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AppRoutes.tsx profile redirect")
