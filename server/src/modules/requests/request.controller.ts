import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import { requestService } from './request.service';

export class RequestController {
  async createRequest(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      
      const newRequest = await requestService.createRequest(employeeId, req.body);
      return sendSuccess(res, newRequest, 'Request created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async getMyRequests(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      
      const requests = await requestService.getMyRequests(employeeId);
      return sendSuccess(res, requests, 'My requests retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async getAllRequests(req: Request, res: Response) {
    try {
      const requests = await requestService.getAllRequests(req.query);
      return sendSuccess(res, requests, 'All requests retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async assignRequest(req: Request, res: Response) {
    try {
      const request = await requestService.assignRequest(req.params.id as string, req.body.assignedToId);
      return sendSuccess(res, request, 'Request assigned successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async updateRequestStatus(req: Request, res: Response) {
    try {
      const request = await requestService.updateRequestStatus(req.params.id as string, req.body);
      return sendSuccess(res, request, 'Request status updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }
}

export const requestController = new RequestController();
