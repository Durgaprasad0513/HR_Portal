import re

with open("client/src/pages/employees/EmployeeDetailPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("import { MoreHorizontal , ArrowLeft, FileText, CheckCircle2} from 'lucide-react';", "import { MoreHorizontal , ArrowLeft, FileText, CheckCircle2, Download} from 'lucide-react';")

with open("client/src/pages/employees/EmployeeDetailPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added Download import")
