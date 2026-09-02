import re

# TravelListPage.tsx
with open("client/src/pages/travel/TravelListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
content = content.replace(
    "import { Input } from '@/components/ui/Input';",
    "import { Input } from '@/components/ui/Input';\nimport { FileUpload } from '@/components/ui/FileUpload';"
)

# Replace in New Travel Modal
content = content.replace(
    '<Input name="billUpload" label="Attachment Link (Optional)" placeholder="https://drive.google.com/..." />',
    '<FileUpload name="billUpload" label="Upload Attachment (Optional)" />'
)

# Replace in Submit Expenses Modal
content = content.replace(
    '<Input name="billUpload" label="Bills/Receipts Link" placeholder="https://drive.google.com/..." required />',
    '<FileUpload name="billUpload" label="Upload Bills/Receipts" required />'
)

with open("client/src/pages/travel/TravelListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

# OfficeExpensesPage.tsx
with open("client/src/pages/expenses/OfficeExpensesPage.tsx", "r", encoding="utf-8") as f:
    content2 = f.read()

# Add import
content2 = content2.replace(
    "import { Input } from '@/components/ui/Input';",
    "import { Input } from '@/components/ui/Input';\nimport { FileUpload } from '@/components/ui/FileUpload';"
)

# Replace in Submit Expense Modal
content2 = content2.replace(
    '<Input name="billUpload" label="Receipt Link" placeholder="https://drive.google.com/..." />',
    '<FileUpload name="billUpload" label="Upload Receipt" />'
)

with open("client/src/pages/expenses/OfficeExpensesPage.tsx", "w", encoding="utf-8") as f:
    f.write(content2)

print("Updated Travel and Office pages to use FileUpload")
