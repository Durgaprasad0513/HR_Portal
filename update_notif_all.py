import re

with open("server/src/modules/notifications/notification.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

new_func = """  async notifyAllEmployees(data: {
    notificationType: 'JOINING' | 'INTERVIEW' | 'OFFER' | 'RESIGNATION' | 'TRAVEL_NOTIF' | 'ASSET_NOTIF' | 'REVIEW_DUE' | 'TRAINING_NOTIF' | 'QUERY_NOTIF' | 'POLICY_UPLOAD';
    message: string;
    triggerEvent?: string;
  }) {
    const activeEmployees = await prisma.employee.findMany({
      where: { isActive: true }
    });
    
    const notifications = activeEmployees.map(emp => ({
      notificationType: data.notificationType,
      message: data.message,
      triggerEvent: data.triggerEvent,
      recipientId: emp.id
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
print("Added notifyAllEmployees to notification.service.ts")
