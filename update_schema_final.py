import re

with open('server/prisma/schema.prisma', 'r') as f:
    content = f.read()

# Replace Float with Decimal everywhere
content = re.sub(r'\bFloat(\??)\b', r'Decimal\1', content)

# Inject into User model
# find 'model User {' and insert before its closing brace
user_pattern = re.compile(r'(model User \{.*?)(\n\})', re.DOTALL)
user_addition = "\n  deactivatedAt     DateTime?\n  tokenVersion      Int           @default(0)"
content = user_pattern.sub(lambda m: m.group(1) + user_addition + m.group(2), content)

# Inject into Employee model
employee_pattern = re.compile(r'(model Employee \{.*?)(\n\})', re.DOTALL)
employee_addition = "\n  isActive          Boolean       @default(true)\n  deactivatedAt     DateTime?"
content = employee_pattern.sub(lambda m: m.group(1) + employee_addition + m.group(2), content)

# Replace onDelete: Cascade with onDelete: Restrict
# Wait, let's just replace them one by one or globally, but globally is fine as requested.
content = content.replace('onDelete: Cascade', 'onDelete: Restrict')

with open('server/prisma/schema.prisma', 'w') as f:
    f.write(content)
print('Done!')
