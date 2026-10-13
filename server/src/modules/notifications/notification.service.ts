import prisma from '../../config/database';

export class NotificationService {

  private deduplicateNotifications<T extends {
    id: string;
    notificationType: string;
    message: string;
    triggerEvent: string | null;
    isRead: boolean;
  }>(notifications: T[]) {
    const byEvent = new Map<string, T>();
    for (const notification of notifications) {
      // Notifications without an event key may represent separate real events.
      const key = notification.triggerEvent
        ? `${notification.notificationType}:${notification.triggerEvent}:${notification.message}`
        : `id:${notification.id}`;
      const existing = byEvent.get(key);
      if (!existing) {
        byEvent.set(key, notification);
      } else if (!notification.isRead && existing.isRead) {
        byEvent.set(key, { ...notification, isRead: false });
      }
    }
    return [...byEvent.values()];
  }

  private async createManyOnce(notifications: Array<{
    notificationType: 'JOINING' | 'INTERVIEW' | 'OFFER' | 'RESIGNATION' | 'TRAVEL_NOTIF' | 'ASSET_NOTIF' | 'REVIEW_DUE' | 'TRAINING_NOTIF' | 'QUERY_NOTIF' | 'POLICY_UPLOAD';
    message: string;
    triggerEvent?: string;
    recipientId: string;
  }>) {
    if (notifications.length === 0) return;
    const eventNotifications = notifications.filter(notification => notification.triggerEvent);
    const unkeyedNotifications = notifications.filter(notification => !notification.triggerEvent);
    const uniqueEventKeys = new Set<string>();
    const uniqueEvents = eventNotifications.filter(notification => {
      const key = `${notification.recipientId}:${notification.notificationType}:${notification.triggerEvent}:${notification.message}`;
      if (uniqueEventKeys.has(key)) return false;
      uniqueEventKeys.add(key);
      return true;
    });
    let newEvents = uniqueEvents;
    if (uniqueEvents.length > 0) {
      const first = uniqueEvents[0];
      const existing = await prisma.notification.findMany({
        where: {
          recipientId: { in: uniqueEvents.map(notification => notification.recipientId) },
          notificationType: first.notificationType,
          triggerEvent: first.triggerEvent,
          message: first.message,
        },
        select: { recipientId: true },
      });
      const existingRecipients = new Set(existing.map(notification => notification.recipientId));
      newEvents = uniqueEvents.filter(notification => !existingRecipients.has(notification.recipientId));
    }
    const data = [...newEvents, ...unkeyedNotifications];
    if (data.length === 0) return;
    return prisma.notification.createMany({ data });
  }
  
  async createNotification(data: {
    notificationType: 'JOINING' | 'INTERVIEW' | 'OFFER' | 'RESIGNATION' | 'TRAVEL_NOTIF' | 'ASSET_NOTIF' | 'REVIEW_DUE' | 'TRAINING_NOTIF' | 'QUERY_NOTIF' | 'POLICY_UPLOAD';
    message: string;
    triggerEvent?: string;
    recipientId: string;
  }) {
    if (!data.recipientId) return null; // Safety check
    if (data.triggerEvent) {
      const existing = await prisma.notification.findFirst({
        where: {
          recipientId: data.recipientId,
          notificationType: data.notificationType,
          triggerEvent: data.triggerEvent,
          message: data.message,
        },
      });
      if (existing) return existing;
    }
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
      where: { role: { in: ['HR', 'ADMIN', 'MANAGER'] }, employeeId: { not: null } }
    });
    
    const notifications = [...new Set(hrUsers.flatMap(hr => hr.employeeId ? [hr.employeeId] : []))].map(recipientId => ({
      notificationType: data.notificationType,
      message: data.message,
      triggerEvent: data.triggerEvent,
      recipientId
    }));
    
    if (notifications.length === 0) return;
    
    return this.createManyOnce(notifications);
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
    
    return this.createManyOnce(notifications);
  }

  async getMyNotifications(recipientId: string) {
    const notifications = await prisma.notification.findMany({
      where: { recipientId },
      orderBy: { createdAt: 'desc' }
    });
    return this.deduplicateNotifications(notifications);
  }

  async markAsRead(id: string, recipientId: string) {
    const notification = await prisma.notification.findFirst({ where: { id, recipientId } });
    if (!notification) throw Object.assign(new Error('Notification not found'), { code: 'P2025' });
    if (notification.triggerEvent) {
      await prisma.notification.updateMany({
        where: {
          recipientId,
          notificationType: notification.notificationType,
          triggerEvent: notification.triggerEvent,
          message: notification.message,
        },
        data: { isRead: true },
      });
      return { ...notification, isRead: true };
    }
    return prisma.notification.update({ where: { id, recipientId }, data: { isRead: true } });
  }

  async markAllAsRead(recipientId: string) {
    return prisma.notification.updateMany({
      where: { recipientId, isRead: false },
      data: { isRead: true }
    });
  }

  async getUnreadCount(recipientId: string) {
    const notifications = await prisma.notification.findMany({
      where: { recipientId },
      select: { id: true, notificationType: true, message: true, triggerEvent: true, isRead: true },
    });
    return this.deduplicateNotifications(notifications).filter(notification => !notification.isRead).length;
  }

  async clearReadNotifications(recipientId: string) {
    const result = await prisma.notification.deleteMany({
      where: { recipientId, isRead: true }
    });
    return result.count;
  }

  async deleteNotification(id: string, recipientId: string) {
    const notification = await prisma.notification.findFirst({ where: { id, recipientId } });
    if (!notification) throw Object.assign(new Error('Notification not found'), { code: 'P2025' });
    if (notification.triggerEvent) {
      return prisma.notification.deleteMany({
        where: {
          recipientId,
          notificationType: notification.notificationType,
          triggerEvent: notification.triggerEvent,
          message: notification.message,
        },
      });
    }
    return prisma.notification.delete({ where: { id, recipientId } });
  }
}

export const notificationService = new NotificationService();
