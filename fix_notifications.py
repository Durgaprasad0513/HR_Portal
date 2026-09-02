import re

# Update notification.service.ts
path = "server/src/modules/notifications/notification.service.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("async markAsRead(id: string) {", "async markAsRead(id: string, recipientId: string) {")
content = content.replace("where: { id },", "where: { id, recipientId },")
content = content.replace("async deleteNotification(id: string) {", "async deleteNotification(id: string, recipientId: string) {")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# Update notification.controller.ts
path = "server/src/modules/notifications/notification.controller.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix markAsRead
markAsRead_func = """  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      const notification = await notificationService.markAsRead(req.params.id as string, employeeId);
      return sendSuccess(res, notification, 'Notification marked as read');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }"""
content = re.sub(r"  async markAsRead\(req: Request, res: Response\) \{[\s\S]*?\} catch \(error: any\) \{[\s\S]*?\}\n  \}", markAsRead_func, content)

# Fix deleteNotification
delete_func = """  async deleteNotification(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      await notificationService.deleteNotification(req.params.id as string, employeeId);
      return sendSuccess(res, null, 'Notification deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }"""
content = re.sub(r"  async deleteNotification\(req: Request, res: Response\) \{[\s\S]*?\} catch \(error: any\) \{[\s\S]*?\}\n  \}", delete_func, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
