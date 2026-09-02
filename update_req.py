import re

with open("server/src/modules/requests/request.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if "import { notificationService }" not in content:
    content = content.replace("import prisma from '../../config/database';", "import prisma from '../../config/database';\nimport { notificationService } from '../notifications/notification.service';")

# 1. createRequest hook
req_create_old = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_REQUEST',
        moduleAffected: 'requests',
        recordIdAffected: req.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return req;"""

req_create_new = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_REQUEST',
        moduleAffected: 'requests',
        recordIdAffected: req.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    await notificationService.notifyHRs({
      notificationType: 'QUERY_NOTIF',
      message: `New HR Helpdesk query submitted: ${req.id}`,
      triggerEvent: req.id
    });

    return req;"""

content = content.replace(req_create_old, req_create_new)

# 2. updateRequestStatus hook
req_update_old = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPDATE_REQUEST_STATUS',
        moduleAffected: 'requests',
        recordIdAffected: req.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return req;"""

req_update_new = """    await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPDATE_REQUEST_STATUS',
        moduleAffected: 'requests',
        recordIdAffected: req.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    if (data.status === 'RESOLVED' || data.status === 'TICKET_CLOSED') {
      await notificationService.createNotification({
        notificationType: 'QUERY_NOTIF',
        message: `Your HR Helpdesk query (${req.id}) has been ${data.status === 'RESOLVED' ? 'resolved' : 'closed'}.`,
        recipientId: req.employeeId,
        triggerEvent: req.id
      });
    }

    return req;"""

content = content.replace(req_update_old, req_update_new)

with open("server/src/modules/requests/request.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated request.service.ts")
