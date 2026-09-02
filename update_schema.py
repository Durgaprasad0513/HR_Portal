import re

with open("server/prisma/schema.prisma", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "enum SettlementStatus {\n  UNSETTLED\n  SETTLED\n}",
    "enum SettlementStatus {\n  UNSETTLED\n  SUBMITTED\n  SETTLED\n}"
)

with open("server/prisma/schema.prisma", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated schema")
