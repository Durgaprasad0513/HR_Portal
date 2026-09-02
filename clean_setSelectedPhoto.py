import re

with open("client/src/pages/assets/AssetListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(" setSelectedPhoto(null);", "")
content = content.replace("setSelectedPhoto(null);\n", "")

with open("client/src/pages/assets/AssetListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Cleaned setSelectedPhoto")
