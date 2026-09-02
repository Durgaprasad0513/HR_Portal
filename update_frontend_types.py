import re

with open("client/src/types/index.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("export type AssetStatus = 'IN_USE' | 'RETURNED' | 'DAMAGED' | 'LOST' | 'RETIRED';", "export type AssetStatus = 'IN_USE' | 'RETURN_REQUESTED' | 'RETURNED' | 'DAMAGED' | 'LOST' | 'RETIRED';")

with open("client/src/types/index.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AssetStatus type in frontend")
