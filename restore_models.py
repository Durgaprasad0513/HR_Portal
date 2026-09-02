import re

with open('server/prisma/schema.prisma', 'r') as f:
    content = f.read()

# Add REMOVED_ROLE back to Role
content = re.sub(r'enum Role \{\n  ADMIN\n  HR\n', 'enum Role {\n  ADMIN\n  HR\n  REMOVED_ROLE\n', content)

# Append the missing models
missing_models = """
// --- Role module permissions (configurable RBAC matrix) ---

model ModulePermission {
  id                 String   @id @default(cuid())
  role               Role
  module             String
  canView            Boolean  @default(false)
  canAdd             Boolean  @default(false)
  canEdit            Boolean  @default(false)
  canDelete          Boolean  @default(false)
  canApprove         Boolean  @default(false)
  canViewRestricted  Boolean  @default(false)

  createdById        String?
  createdBy          User?    @relation("PermissionCreator", fields: [createdById], references: [id])

  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@unique([role, module])
  @@map("module_permissions")
}

// --- Login History ---

model LoginHistory {
  id            String    @id @default(cuid())
  loginTime     DateTime  @default(now())
  logoutTime    DateTime?
  ipAddress     String?
  deviceBrowser String?

  userId        String
  user          User      @relation("UserLoginHistory", fields: [userId], references: [id])

  @@map("login_history")
}

model SystemSettings {
  id                    String   @id @default(uuid())
  minPasswordLength     Int      @default(8)
  requireUppercase      Boolean  @default(true)
  requireNumbers        Boolean  @default(true)
  requireSpecialChars   Boolean  @default(true)
  passwordExpiryDays    Int      @default(90)
  updatedAt             DateTime @updatedAt

  @@map("system_settings")
}
"""

if 'model SystemSettings' not in content:
    content += "\n" + missing_models

# Wait, the user model needs the relations!
user_relations = """
  permissionsCreated    ModulePermission[] @relation("PermissionCreator")
  loginHistory          LoginHistory[]     @relation("UserLoginHistory")
"""

if 'PermissionCreator' not in content:
    content = re.sub(r'(model User \{[^}]+)(createdAt\s+DateTime)', user_relations + r'\2', content)

with open('server/prisma/schema.prisma', 'w') as f:
    f.write(content)
print('Done!')
