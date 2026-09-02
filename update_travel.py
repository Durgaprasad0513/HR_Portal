import re

with open("server/src/modules/travel/travel.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if "import { notificationService }" not in content:
    content = content.replace("import prisma from '../../config/database';", "import prisma from '../../config/database';\nimport { notificationService } from '../notifications/notification.service';")

# 1. createTravelRequest hook
travel_create_old = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_TRAVEL_REQUEST',
        moduleAffected: 'travel',
        recordIdAffected: req.id,
        userId: currentUser.userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return req;"""

travel_create_new = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_TRAVEL_REQUEST',
        moduleAffected: 'travel',
        recordIdAffected: req.id,
        userId: currentUser.userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    if (req.approverId) {
      await notificationService.createNotification({
        notificationType: 'TRAVEL_NOTIF',
        message: `New travel request pending approval from ${req.employeeId}.`,
        recipientId: req.approverId,
        triggerEvent: req.id
      });
    } else {
      await notificationService.notifyHRs({
        notificationType: 'TRAVEL_NOTIF',
        message: `New travel request created (ID: ${req.id}).`,
        triggerEvent: req.id
      });
    }

    return req;"""

content = content.replace(travel_create_old, travel_create_new)

# 2. updateApprovalStatus hook
travel_update_old = """      await tx.auditLog.create({
        data: {
          actionPerformed: 'UPDATE_TRAVEL_APPROVAL',
          moduleAffected: 'travel',
          recordIdAffected: updated.id,
          userId: currentUser.userId,
          ipAddress: reqContext.ipAddress,
        }
      });

      return updated;"""

travel_update_new = """      await tx.auditLog.create({
        data: {
          actionPerformed: 'UPDATE_TRAVEL_APPROVAL',
          moduleAffected: 'travel',
          recordIdAffected: updated.id,
          userId: currentUser.userId,
          ipAddress: reqContext.ipAddress,
        }
      });

      await notificationService.createNotification({
        notificationType: 'TRAVEL_NOTIF',
        message: `Your travel request has been ${updated.approvalStatus === 'APPROVAL_APPROVED' ? 'approved' : 'rejected'}.`,
        recipientId: updated.employeeId,
        triggerEvent: updated.id
      });

      return updated;"""

content = content.replace(travel_update_old, travel_update_new)

with open("server/src/modules/travel/travel.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated travel.service.ts")
