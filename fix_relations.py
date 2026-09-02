import re

with open("server/prisma/schema.prisma", "r", encoding="utf-8") as f:
    content = f.read()

employee_model_end = r"  createdAt     DateTime       @default\(now\(\)\)"
new_relations = """  submittedOfficeExpenses OfficeExpense[] @relation("SubmittedOfficeExpenses")
  approvedOfficeExpenses  OfficeExpense[] @relation("ApprovedOfficeExpenses")
  
  createdAt     DateTime       @default(now())"""

content = re.sub(employee_model_end, new_relations, content)

with open("server/prisma/schema.prisma", "w", encoding="utf-8") as f:
    f.write(content)
print("Added relations to Employee model")
