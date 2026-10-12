import prisma from '../config/database';

export type NotificationChannel = 'IN_APP';

export interface NotificationPayload {
  employeeId: string;
  notificationType: string;
  message: string;
  triggerEvent?: string;
  channels?: NotificationChannel[];
}

class NotificationDispatcher {
  /** Persists in-app notifications. This portal does not send email. */
  async dispatch(payload: NotificationPayload): Promise<void> {
    const channels = payload.channels ?? ['IN_APP'];

    // Always persist in-app if requested
    if (channels.includes('IN_APP')) {
      try {
        await prisma.notification.create({
          data: {
            notificationType: payload.notificationType as any,
            message: payload.message,
            triggerEvent: payload.triggerEvent,
            deliveryChannel: 'IN_APP',
            recipientId: payload.employeeId,
          }
        });
      } catch (err) {
        console.error('[Notification] Failed to persist in-app notification:', err);
      }
    }
  }
}

export const notificationDispatcher = new NotificationDispatcher();
