import re

with open("client/src/api/assets.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("apiClient.patch", "apiClient.put")

with open("client/src/api/assets.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated assetsApi to use put")
