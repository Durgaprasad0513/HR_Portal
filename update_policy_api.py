import re

with open("client/src/api/policies.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "`/policies/${id}/acknowledge`",
    "`/policies/${id}/acknowledge`, { status: 'ACKNOWLEDGED' }"
)

with open("client/src/api/policies.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated policies.ts")
