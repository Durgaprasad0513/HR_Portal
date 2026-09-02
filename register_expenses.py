import re

with open("server/src/app.ts", "r", encoding="utf-8") as f:
    content = f.read()

import_str = "import travelRoutes from './modules/travel/travel.routes';\\nimport expenseRoutes from './modules/expenses/expense.routes';"
content = re.sub(r"import travelRoutes from '\./modules/travel/travel\.routes';", import_str, content)

use_str = "app.use('/api/travel', travelRoutes);\\napp.use('/api/office-expenses', expenseRoutes);"
content = re.sub(r"app\.use\('/api/travel', travelRoutes\);", use_str, content)

with open("server/src/app.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Registered expenseRoutes in app.ts")
