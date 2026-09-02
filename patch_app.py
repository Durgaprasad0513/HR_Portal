import re

with open("server/src/app.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r"import settingsRoutes from './modules/settings/settings\.routes';\n", "", content)
content = re.sub(r"\s*app\.use\('/api/settings', settingsRoutes\);", "", content)

with open("server/src/app.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Removed settings routes from app.ts")
