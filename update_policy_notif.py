import re

with open("server/src/modules/policies/policy.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if "import { notificationService }" not in content:
    content = content.replace("import prisma from '../../config/database';", "import prisma from '../../config/database';\nimport { notificationService } from '../notifications/notification.service';")

# 1. createPolicy hook
policy_old = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_POLICY',
        moduleAffected: 'policies',
        recordIdAffected: policy.id,
        userId: uploadedById,
        ipAddress: reqContext.ipAddress,
      }
    });

    return policy;"""

policy_new = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_POLICY',
        moduleAffected: 'policies',
        recordIdAffected: policy.id,
        userId: uploadedById,
        ipAddress: reqContext.ipAddress,
      }
    });

    await notificationService.notifyAllEmployees({
      notificationType: 'POLICY_UPLOAD',
      message: `New document published: ${policy.policyName} (${policy.versionNumber})`,
      triggerEvent: policy.id
    });

    return policy;"""

content = content.replace(policy_old, policy_new)

with open("server/src/modules/policies/policy.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated policy.service.ts")
