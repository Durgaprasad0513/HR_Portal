import re

with open("server/src/modules/performance/performance.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if "import { notificationService }" not in content:
    content = content.replace("import prisma from '../../config/database';", "import prisma from '../../config/database';\nimport { notificationService } from '../notifications/notification.service';")

# 1. createReview hook
create_old = """      await tx.auditLog.create({
        data: {
          actionPerformed: 'CREATE_PERFORMANCE_REVIEW',
          moduleAffected: 'performance',
          recordIdAffected: review.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });

      return review;"""

create_new = """      await tx.auditLog.create({
        data: {
          actionPerformed: 'CREATE_PERFORMANCE_REVIEW',
          moduleAffected: 'performance',
          recordIdAffected: review.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });

      await notificationService.createNotification({
        notificationType: 'REVIEW_DUE',
        message: `Your performance review cycle is starting. Please submit your self-appraisal.`,
        recipientId: review.employeeId,
        triggerEvent: review.id
      });

      return review;"""

content = content.replace(create_old, create_new)

with open("server/src/modules/performance/performance.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated performance.service.ts")
