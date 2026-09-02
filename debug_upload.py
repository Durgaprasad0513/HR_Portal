import re

with open("server/src/modules/assets/asset.routes.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("return res.json({ success: true, data: { photoUrl: /uploads/ } });",
                          "console.log(req.file); return res.json({ success: true, data: { photoUrl: /uploads/ } });")

with open("server/src/modules/assets/asset.routes.ts", "w", encoding="utf-8") as f:
    f.write(content)
