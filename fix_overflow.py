import re

# Fix EmployeeListPage
with open("client/src/pages/employees/EmployeeListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()
content = re.sub(
    r'(<div className="h-10 w-10[^>]*>[\s\S]*?</div>\s*)<div>(\s*<p[^>]*truncate)',
    r'\1<div className="min-w-0 flex-1">\2',
    content
)
with open("client/src/pages/employees/EmployeeListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

# Fix TrainingListPage
with open("client/src/pages/training/TrainingListPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()
content = re.sub(
    r'(<div className="h-10 w-10[^>]*>[\s\S]*?</div>\s*)<div>(\s*<p[^>]*truncate)',
    r'\1<div className="min-w-0 flex-1">\2',
    content
)
with open("client/src/pages/training/TrainingListPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed card overflow issues")
