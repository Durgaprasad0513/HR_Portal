import prisma from '../../config/database';

export class NotificationService {
  
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

    async notifyAllEmployees(data: {
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

  async getMyNotifications(recipientId: string) {
    return prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(id: string, recipientId: string) {
    return prisma.notification.update({
      where: { id, recipientId },
      data: { isRead: true }
    });
  }

  async markAllAsRead(recipientId: string) {
    return prisma.notification.updateMany({
      where: { recipientId, isRead: false },
      data: { isRead: true }
    });
  }

  async getUnreadCount(recipientId: string) {
    return prisma.notification.count({
      where: { recipientId, isRead: false }
    });
  }

  async deleteNotification(id: string, recipientId: string) {
    return prisma.notification.delete({
      where: { id }
    });
  }
}

export const notificationService = new NotificationService();
