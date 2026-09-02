import re

# 1. Update auth.schema.ts
path = "server/src/modules/auth/auth.schema.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_schemas = """
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters')
  })
});

export const setupPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters')
  })
});
"""
content += new_schemas
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update auth.routes.ts
path = "server/src/modules/auth/auth.routes.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { loginSchema } from './auth.schema';", "import { loginSchema, changePasswordSchema, setupPasswordSchema } from './auth.schema';")

new_routes = """
router.post('/change-password', authenticate, validate(changePasswordSchema), (req, res) => authController.changePassword(req, res));
router.post('/setup-password', validate(setupPasswordSchema), (req, res) => authController.setupPassword(req, res));
"""
content = content.replace("export default router;", new_routes + "\nexport default router;")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
