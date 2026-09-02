import re

path = "server/src/app.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import employeeRoutes from './modules/employees/employee.routes';", "import employeeRoutes from './modules/employees/employee.routes';\nimport documentRoutes from './modules/employees/document.routes';")
content = content.replace("app.use('/api/employees', employeeRoutes);", "app.use('/api/employees/documents', documentRoutes);\napp.use('/api/employees', employeeRoutes);")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
