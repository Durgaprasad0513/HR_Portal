import re

with open("server/prisma/schema.prisma", "r", encoding="utf-8") as f:
    content = f.read()

# Add photoUrl to Asset
old_asset = """  returnCondition    AssetReturnCondition?
  status             AssetStatus           @default(IN_USE)
  remarks            String?"""

new_asset = """  returnCondition    AssetReturnCondition?
  status             AssetStatus           @default(IN_USE)
  remarks            String?
  photoUrl           String?"""

content = content.replace(old_asset, new_asset)

with open("server/prisma/schema.prisma", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated schema.prisma")
