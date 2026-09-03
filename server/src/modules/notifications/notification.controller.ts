import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import { notificationService } from './notification.service';

export class NotificationController {
  async getMyNotifications(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      
      const notifications = await notificationService.getMyNotifications(employeeId);
      return sendSuccess(res, notifications, 'Notifications retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      const notification = await notificationService.markAsRead(req.params.id as string, employeeId);
      return sendSuccess(res, notification, 'Notification marked as read');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      
      const count = await notificationService.markAllAsRead(employeeId);
      return sendSuccess(res, count, 'All notifications marked as read');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async getUnreadCount(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      
      const count = await notificationService.getUnreadCount(employeeId);
      return sendSuccess(res, { count }, 'Unread count retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async clearReadNotifications(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      const count = await notificationService.clearReadNotifications(employeeId);
      return sendSuccess(res, { count }, 'Read notifications cleared successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async deleteNotification(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      await notificationService.deleteNotification(req.params.id as string, employeeId);
      return sendSuccess(res, null, 'Notification deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }
}

export const notificationController = new NotificationController();
