import re

with open("server/src/app.ts", "r", encoding="utf-8") as f:
    content = f.read()

import_str = "import expenseRoutes from './modules/expenses/expense.routes';\nimport uploadRoutes from './modules/upload/upload.routes';"
content = re.sub(r"import expenseRoutes from '\./modules/expenses/expense\.routes';", import_str, content)

use_str = "app.use('/api/office-expenses', expenseRoutes);\napp.use('/api/upload', uploadRoutes);"
content = re.sub(r"app\.use\('/api/office-expenses', expenseRoutes\);", use_str, content)

with open("server/src/app.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Registered uploadRoutes in app.ts")
