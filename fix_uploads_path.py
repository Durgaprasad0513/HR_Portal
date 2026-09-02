import re

with open("server/src/app.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("app.use('/uploads', express.static", "app.use('/api/uploads', express.static")

with open("server/src/app.ts", "w", encoding="utf-8") as f:
    f.write(content)

with open("server/src/modules/assets/asset.routes.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("`/uploads/${req.file.filename}`", "`/api/uploads/${req.file.filename}`")

with open("server/src/modules/assets/asset.routes.ts", "w", encoding="utf-8") as f:
    f.write(content)
