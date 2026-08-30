import { Request, Response } from 'express';
import { travelService } from './travel.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export class TravelController {
  async createTravelRequest(req: AuthRequest, res: Response) {
    try {
      const result = await travelService.createTravelRequest(req.user!, req.body, { ipAddress: req.ip });
      return sendSuccess(res, result, 'Travel request created successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async getTravelRequests(req: AuthRequest, res: Response) {
    try {
      const result = await travelService.getTravelRequests(req.user!, req.query);
      return sendSuccess(res, result, 'Travel requests retrieved');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async getTravelRequestById(req: AuthRequest, res: Response) {
    try {
      const result = await travelService.getTravelRequestById(req.user!, req.params.id as string);
      return sendSuccess(res, result, 'Travel request retrieved');
    } catch (error: any) {
      return sendError(res, error.message, 404);
    }
  }

  async updateApprovalStatus(req: AuthRequest, res: Response) {
    try {
      const result = await travelService.updateApprovalStatus(req.params.id as string, req.body, req.user!.employeeId!, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, result, 'Approval status updated');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async updateSettlement(req: AuthRequest, res: Response) {
    try {
      const result = await travelService.updateSettlement(req.params.id as string, req.body, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, result, 'Settlement recorded');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }
}

export const travelController = new TravelController();
