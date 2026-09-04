import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendSuccess, sendError } from '../../utils/response';
import { userManagementService } from './user.service';

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userManagementService.getAllUsers(req.query);
      return sendSuccess(res, users, 'Users retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await userManagementService.getUserById(req.params.id as string);
      if (!user) return sendError(res, 'User not found', 404);
      return sendSuccess(res, user, 'User retrieved');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async changeRole(req: AuthRequest, res: Response) {
    try {
      const { role } = req.body;
      if (!role) return sendError(res, 'Role is required', 400);
      const user = await userManagementService.changeRole(req.params.id as string, role, req.user!.userId);
      return sendSuccess(res, user, 'Role updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async toggleStatus(req: AuthRequest, res: Response) {
    try {
      const { isActive } = req.body;
      if (isActive === undefined) return sendError(res, 'isActive is required', 400);
      const user = await userManagementService.toggleStatus(req.params.id as string, Boolean(isActive), req.user!.userId);
      return sendSuccess(res, user, `User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async resetPassword(req: AuthRequest, res: Response) {
    try {
      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) return sendError(res, 'Password must be at least 6 characters', 400);
      await userManagementService.resetPassword(req.params.id as string, newPassword, req.user!.userId);
      return sendSuccess(res, null, 'Password reset successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }
}

export const userController = new UserController();
