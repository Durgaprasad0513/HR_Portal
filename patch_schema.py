import re

with open("server/prisma/schema.prisma", "r", encoding="utf-8") as f:
    content = f.read()

# Match the model block and remove it
pattern = r"model SystemSettings \{.*?\n\}"
content = re.sub(pattern, "", content, flags=re.DOTALL)

with open("server/prisma/schema.prisma", "w", encoding="utf-8") as f:
    f.write(content)
print("Removed SystemSettings from schema.prisma")
