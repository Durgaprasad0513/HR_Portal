import re

path = "server/src/app.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { v4 as uuidv4 } from 'uuid';", "import crypto from 'crypto';")
content = content.replace("uuidv4()", "crypto.randomUUID()")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
