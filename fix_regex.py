import re

with open("server/src/modules/assets/asset.routes.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("console.log(req.file); return res.json({ success: true, data: { photoUrl: /uploads/ } });",
                          "return res.json({ success: true, data: { photoUrl: `/uploads/${req.file.filename}` } });")

with open("server/src/modules/assets/asset.routes.ts", "w", encoding="utf-8") as f:
    f.write(content)
