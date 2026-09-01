import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { ModuleKey, PermissionAction } from '../modules/permissions/permission.catalog';
import { permissionService } from '../modules/permissions/permission.service';
import prisma from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: string; // standardize on id
    userId: string;
    email: string;
    role: string;
    employeeId: string | null;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Access denied. No token provided.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as any;

    // Verify user still exists, is active, etc.
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      sendError(res, 'Account deactivated or invalid.', 401);
      return;
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      sendError(res, 'Session revoked. Please log in again.', 401);
      return;
    }

req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      employeeId: decoded.employeeId
    };
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token.', 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'You do not have permission to perform this action.', 403);
      return;
    }

    next();
  };
};

export const requirePermission = (module: ModuleKey, action: PermissionAction) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    const allowed = await permissionService.hasPermission(req.user.role as Role, module, action);
    if (!allowed) {
      sendError(res, 'You do not have permission to perform this action.', 403);
      return;
    }

    next();
  };
};

export const requireStaffView = (module: ModuleKey) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendError(res, 'Authentication required.', 401);
      return;
    }

    if (req.user.role === Role.EMPLOYEE) {
      sendError(res, 'You do not have permission to perform this action.', 403);
      return;
    }

    const allowed = await permissionService.hasPermission(req.user.role as Role, module, 'view');
    if (!allowed) {
      sendError(res, 'You do not have permission to perform this action.', 403);
      return;
    }

    next();
  };
};
