import prisma from '../../config/database';

export class NotificationService {
  async getMyNotifications(recipientId: string) {
    return prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
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

  async deleteNotification(id: string) {
    return prisma.notification.delete({
      where: { id }
    });
  }
}

export const notificationService = new NotificationService();
