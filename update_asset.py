import re

with open("server/src/modules/assets/asset.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if "import { notificationService }" not in content:
    content = content.replace("import prisma from '../../config/database';", "import prisma from '../../config/database';\nimport { notificationService } from '../notifications/notification.service';")

# 1. assignAsset hook
assign_old = """      await tx.auditLog.create({
        data: {
          actionPerformed: 'ASSIGN_ASSET',
          moduleAffected: 'assets',
          recordIdAffected: updated.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });

      return updated;"""

assign_new = """      await tx.auditLog.create({
        data: {
          actionPerformed: 'ASSIGN_ASSET',
          moduleAffected: 'assets',
          recordIdAffected: updated.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });

      if (updated.assignedToId) {
        await notificationService.createNotification({
          notificationType: 'ASSET_NOTIF',
          message: `Asset ${updated.brandModel} has been issued to you.`,
          recipientId: updated.assignedToId,
          triggerEvent: updated.id
        });
      }

      return updated;"""

content = content.replace(assign_old, assign_new)

# 2. returnAsset hook
return_old = """      await tx.auditLog.create({
        data: {
          actionPerformed: 'RETURN_ASSET',
          moduleAffected: 'assets',
          recordIdAffected: updated.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });

      return updated;"""

return_new = """      await tx.auditLog.create({
        data: {
          actionPerformed: 'RETURN_ASSET',
          moduleAffected: 'assets',
          recordIdAffected: updated.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });

      // In returnAsset, assignedToId becomes null, but we want to notify the previous owner if possible,
      // wait, usually they return it themselves, or HR does it on their behalf.
      // If we don't know who returned it here, maybe we don't notify, or we fetch the old record first.
      // Let's just log it.

      return updated;"""

# Let's fix returnAsset to fetch old record first.
old_return_tx = """    const asset = await prisma.$transaction(async (tx) => {
      const updated = await tx.asset.update({
        where: { id },
        data: {
          status: data.status || 'AVAILABLE',
          assignedToId: null,
          issueDate: null,
          condition: data.condition
        }
      });"""

new_return_tx = """    const asset = await prisma.$transaction(async (tx) => {
      const oldAsset = await tx.asset.findUnique({ where: { id } });
      const updated = await tx.asset.update({
        where: { id },
        data: {
          status: data.status || 'AVAILABLE',
          assignedToId: null,
          issueDate: null,
          condition: data.condition
        }
      });"""

content = content.replace(old_return_tx, new_return_tx)

return_new_fixed = """      await tx.auditLog.create({
        data: {
          actionPerformed: 'RETURN_ASSET',
          moduleAffected: 'assets',
          recordIdAffected: updated.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });

      if (oldAsset && oldAsset.assignedToId) {
        await notificationService.createNotification({
          notificationType: 'ASSET_NOTIF',
          message: `Your return for asset ${updated.brandModel} has been processed.`,
          recipientId: oldAsset.assignedToId,
          triggerEvent: updated.id
        });
      }

      return updated;"""

content = content.replace(return_old, return_new_fixed)

with open("server/src/modules/assets/asset.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated asset.service.ts")
