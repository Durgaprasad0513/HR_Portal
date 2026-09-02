import re

path = "server/src/modules/auth/auth.service.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import at the top
if "import { hashPassword" not in content:
    content = content.replace("import prisma from '../../config/database';", "import prisma from '../../config/database';\nimport { hashPassword } from '../../utils/password';")

# Remove require()
content = content.replace("const { hashPassword } = require('../../utils/password');\n    const hashedPassword = await hashPassword", "const hashedPassword = await hashPassword")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
