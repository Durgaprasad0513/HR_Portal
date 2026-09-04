import { Request, Response, NextFunction } from 'express';
import { requestService } from './request.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../config/database';

export class RequestController {
  async createRequest(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      
      const newReq = await requestService.createRequest(employeeId, req.body, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, newReq, 'Request created successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async getMyRequests(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      
      const requests = await requestService.getMyRequests(employeeId);
      return sendSuccess(res, requests, 'Requests retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async getAllRequests(req: Request, res: Response) {
    try {
      const requests = await requestService.getAllRequests(req.query);
      return sendSuccess(res, requests, 'Requests retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async assignRequest(req: AuthRequest, res: Response) {
    try {
      const assigned = await requestService.assignRequest(req.params.id as string, req.body.assignedToId, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, assigned, 'Request assigned successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async updateRequestStatus(req: AuthRequest, res: Response) {
    try {
      const updated = await requestService.updateRequestStatus(req.params.id as string, req.body, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, updated, 'Request status updated');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  getStaffUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const staff = await prisma.user.findMany({
        where: { role: { in: ['ADMIN', 'HR'] } },
        select: { id: true, email: true, employee: { select: { firstName: true, lastName: true } } }
      });
      res.json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  };
}

export const requestController = new RequestController();
