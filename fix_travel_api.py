import re

with open("client/src/api/travel.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("apiClient.patch", "apiClient.put")

with open("client/src/api/travel.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated travel.ts to use PUT instead of PATCH")
