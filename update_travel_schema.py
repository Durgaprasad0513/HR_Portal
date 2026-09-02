import re

with open("server/src/modules/travel/travel.schema.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "advanceRequested: z.number().optional()",
    "advanceRequested: z.number().optional(),\n  billUpload: z.string().optional()"
)

with open("server/src/modules/travel/travel.schema.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated travel schema")
