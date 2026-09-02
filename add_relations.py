import re

with open('server/prisma/schema.prisma', 'r') as f:
    content = f.read()

# Add missing relations to User
rel_login = 'loginHistory           LoginHistory[]     @relation("UserLoginHistory")'
rel_perms = 'permissionsCreated     ModulePermission[] @relation("PermissionCreator")'

# Remove existing bare loginHistory
content = re.sub(r'loginHistory\s+LoginHistory\[\]', '', content)
content = re.sub(r'(assignedRequests.*?)(createdAt\s+DateTime)', r'\1\n  ' + rel_login + '\n  ' + rel_perms + '\n\n  ' + r'\2', content, flags=re.DOTALL)

with open('server/prisma/schema.prisma', 'w') as f:
    f.write(content)
print('Done!')
