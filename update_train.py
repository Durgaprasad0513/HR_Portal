import re

with open("server/src/modules/training/training.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if "import { notificationService }" not in content:
    content = content.replace("import prisma from '../../config/database';", "import prisma from '../../config/database';\nimport { notificationService } from '../notifications/notification.service';")

# 1. addParticipant hook
part_old = """      await tx.auditLog.create({
        data: {
          actionPerformed: 'ADD_TRAINING_PARTICIPANT',
          moduleAffected: 'training',
          recordIdAffected: trainingId,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });

      return participant;"""

part_new = """      await tx.auditLog.create({
        data: {
          actionPerformed: 'ADD_TRAINING_PARTICIPANT',
          moduleAffected: 'training',
          recordIdAffected: trainingId,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });

      // Get training details for the notification
      const training = await tx.training.findUnique({ where: { id: trainingId } });
      if (training) {
        await notificationService.createNotification({
          notificationType: 'TRAINING_NOTIF',
          message: `You have been scheduled for training: ${training.trainingTopic}`,
          recipientId: employeeId,
          triggerEvent: trainingId
        });
      }

      return participant;"""

content = content.replace(part_old, part_new)

with open("server/src/modules/training/training.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated training.service.ts")
