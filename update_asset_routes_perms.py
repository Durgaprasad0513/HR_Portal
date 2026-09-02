import re

with open("server/src/modules/assets/asset.routes.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Change permissions for employee self-service actions
content = content.replace("router.put('/:id/return', requirePermission('assets', 'edit'),", "router.put('/:id/return', authenticate,")
content = content.replace("router.put('/:id/damage', requirePermission('assets', 'edit'),", "router.put('/:id/damage', authenticate,")
content = content.replace("router.put('/:id/lost', requirePermission('assets', 'edit'),", "router.put('/:id/lost', authenticate,")

with open("server/src/modules/assets/asset.routes.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated asset routes for return/damage/lost")
