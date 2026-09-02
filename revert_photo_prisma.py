import re

with open("server/prisma/schema.prisma", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("  photoUrl           String?\n", "")
content = content.replace("  RETURNED", "  RETURN_REQUESTED\n  RETURNED")

with open("server/prisma/schema.prisma", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated schema.prisma")
