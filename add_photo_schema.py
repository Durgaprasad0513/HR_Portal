import re

with open("server/src/modules/assets/asset.schema.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("assetLocation: z.string().optional(),", "assetLocation: z.string().optional(),\n  photoUrl: z.string().optional(),")

with open("server/src/modules/assets/asset.schema.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated asset schema")
