import { Router } from 'express';
import { notificationController } from './notification.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(requirePermission('notifications', 'view'));

router.get('/', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/mark-all-read', requirePermission('notifications', 'edit'), notificationController.markAllAsRead);
router.delete('/read/clear', requirePermission('notifications', 'delete'), notificationController.clearReadNotifications);
router.patch('/:id/read', requirePermission('notifications', 'edit'), notificationController.markAsRead);
router.delete('/:id', requirePermission('notifications', 'delete'), notificationController.deleteNotification);

export default router;
