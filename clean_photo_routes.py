import re

with open("server/src/modules/assets/asset.schema.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("  photoUrl: z.string().optional(),\n", "")
content = content.replace("'IN_USE', 'RETURNED'", "'IN_USE', 'RETURN_REQUESTED', 'RETURNED'")

with open("server/src/modules/assets/asset.schema.ts", "w", encoding="utf-8") as f:
    f.write(content)

with open("server/src/modules/assets/asset.routes.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r"router\.post\('/upload-photo',.*?\);", "", content, flags=re.DOTALL)

with open("server/src/modules/assets/asset.routes.ts", "w", encoding="utf-8") as f:
    f.write(content)
