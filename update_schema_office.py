import re

with open("server/prisma/schema.prisma", "r", encoding="utf-8") as f:
    content = f.read()

# Add to Employee model
employee_relations = """  approvedTravel          TravelRequest[] @relation("ApprovedTravel")
  submittedOfficeExpenses OfficeExpense[] @relation("SubmittedOfficeExpenses")
  approvedOfficeExpenses  OfficeExpense[] @relation("ApprovedOfficeExpenses")"""
content = re.sub(r"  approvedTravel\s*TravelRequest\[\]\s*@relation\(\"ApprovedTravel\"\)", employee_relations, content)

# Add Enums and Model
new_model = """
enum ExpenseCategory {
  STATIONERY
  FOOD_SNACKS
  MAINTENANCE
  UTILITIES
  IT_SOFTWARE
  OTHER
}

enum ExpenseStatus {
  PENDING
  APPROVED
  REJECTED
  PAID
}

model OfficeExpense {
  id              String          @id @default(cuid())
  expenseDate     DateTime        @db.Date
  category        ExpenseCategory
  description     String
  amount          Decimal
  billUpload      String?
  status          ExpenseStatus   @default(PENDING)
  
  submittedById   String
  submittedBy     Employee        @relation("SubmittedOfficeExpenses", fields: [submittedById], references: [id])
  
  approvedById    String?
  approvedBy      Employee?       @relation("ApprovedOfficeExpenses", fields: [approvedById], references: [id])
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}
"""

content += new_model

with open("server/prisma/schema.prisma", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated schema.prisma with OfficeExpense")
