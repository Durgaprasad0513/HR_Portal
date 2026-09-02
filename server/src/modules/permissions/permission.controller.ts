import { Response } from 'express';
import { Role } from '@prisma/client';
import { AuthRequest } from '../../middleware/auth.middleware';
import { sendError, sendSuccess } from '../../utils/response';
import { permissionService } from './permission.service';
import { UpdatePermissionInput } from './permission.schema';

export class PermissionController {
  async getMyPermissions(req: AuthRequest, res: Response) {
    try {
      const role = req.user?.role as Role;
      const perms = await permissionService.getForRole(role);
      // Convert array to module-keyed map for easy frontend lookup
      const map: Record<string, any> = {};
      for (const p of perms) {
        map[p.module] = p;
      }
      sendSuccess(res, map, 'My permissions retrieved');
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  async getMatrix(_req: AuthRequest, res: Response) {
    try {
      const matrix = await permissionService.getMatrix();
      sendSuccess(res, matrix, 'Permission matrix retrieved');
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  async updatePermission(req: AuthRequest, res: Response) {
    try {
      const body = req.body as UpdatePermissionInput;
      const updated = await permissionService.updatePermission(
        body.role as Role,
        body.module,
        body,
        req.user?.userId
      );
      sendSuccess(res, updated, 'Permission updated');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}

export const permissionController = new PermissionController();
