import re

with open("server/src/modules/notifications/notification.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

new_func = """
  async createNotification(data: {
    notificationType: 'JOINING' | 'INTERVIEW' | 'OFFER' | 'RESIGNATION' | 'TRAVEL_NOTIF' | 'ASSET_NOTIF' | 'REVIEW_DUE' | 'TRAINING_NOTIF' | 'QUERY_NOTIF' | 'POLICY_UPLOAD';
    message: string;
    triggerEvent?: string;
    recipientId: string;
  }) {
    if (!data.recipientId) return null; // Safety check
    return prisma.notification.create({
      data: {
        notificationType: data.notificationType,
        message: data.message,
        triggerEvent: data.triggerEvent,
        recipientId: data.recipientId
      }
    });
  }

  async notifyHRs(data: {
    notificationType: 'JOINING' | 'INTERVIEW' | 'OFFER' | 'RESIGNATION' | 'TRAVEL_NOTIF' | 'ASSET_NOTIF' | 'REVIEW_DUE' | 'TRAINING_NOTIF' | 'QUERY_NOTIF' | 'POLICY_UPLOAD';
    message: string;
    triggerEvent?: string;
  }) {
    const hrUsers = await prisma.user.findMany({
      where: { role: { in: ['HR', 'ADMIN'] }, employeeId: { not: null } }
    });
    
    const notifications = hrUsers.map(hr => ({
      notificationType: data.notificationType,
      message: data.message,
      triggerEvent: data.triggerEvent,
      recipientId: hr.employeeId!
    }));
    
    if (notifications.length === 0) return;
    
    return prisma.notification.createMany({
      data: notifications
    });
  }
"""

content = content.replace(
    "async getMyNotifications",
    new_func + "\n  async getMyNotifications"
)

with open("server/src/modules/notifications/notification.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated notification.service.ts")
