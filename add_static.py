import re

with open("server/src/app.ts", "r", encoding="utf-8") as f:
    content = f.read()

if "express.static" not in content:
    content = content.replace("app.use(express.json());", "app.use(express.json());\napp.use('/uploads', express.static(path.join(__dirname, '../uploads')));")
    if "import path" not in content:
        content = "import path from 'path';\n" + content
    with open("server/src/app.ts", "w", encoding="utf-8") as f:
        f.write(content)
    print("Added static serve")
