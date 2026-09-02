import re

with open('server/prisma/schema.prisma', 'r') as f:
    content = f.read()

# Replace Float with Decimal everywhere
content = re.sub(r'\bFloat(\??)\b', r'Decimal\1', content)

# Add deactivatedAt and tokenVersion to User (since isActive is already there)
user_addition = """
  deactivatedAt     DateTime?
  tokenVersion      Int           @default(0)
"""
content = re.sub(r'(model User \{[^}]+)(createdAt\s+DateTime)', user_addition + r'\2', content)

# Add isActive and deactivatedAt to Employee
employee_addition = """
  isActive          Boolean       @default(true)
  deactivatedAt     DateTime?
"""
content = re.sub(r'(model Employee \{[^}]+)(createdAt\s+DateTime)', employee_addition + r'\2', content)

# Replace Cascade with Restrict
content = content.replace('onDelete: Cascade', 'onDelete: Restrict')

with open('server/prisma/schema.prisma', 'w') as f:
    f.write(content)
print('Done!')
