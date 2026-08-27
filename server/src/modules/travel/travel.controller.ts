import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { travelService } from './travel.service';
import { sendSuccess, sendError } from '../../utils/response';
import { Role } from '@prisma/client';

export class TravelController {
  async createTravelRequest(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.employeeId) {
        return sendError(res, 'Employee profile not found', 400);
      }
      const travelRequest = await travelService.createTravelRequest(req.user.employeeId, req.body);
      return sendSuccess(res, travelRequest, 'Travel request created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Error creating travel request', 400);
    }
  }

  async getMyRequests(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.employeeId) {
        return sendError(res, 'Employee profile not found', 400);
      }
      const requests = await travelService.getTravelRequests({ employeeId: req.user.employeeId });
      return sendSuccess(res, requests, 'Travel requests retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Error retrieving travel requests');
    }
  }

  async getAllRequests(req: AuthRequest, res: Response) {
    try {
      const requests = await travelService.getTravelRequests({});
      return sendSuccess(res, requests, 'Travel requests retrieved successfully');
    } catch (error) {
      return sendError(res, 'Error retrieving travel requests');
    }
  }

  async getRequestById(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const request = await travelService.getTravelRequestById(id as string);
      
      if (!request) {
        return sendError(res, 'Travel request not found', 404);
      }
      
      if (req.user!.role === Role.EMPLOYEE && request.employeeId !== req.user!.employeeId) {
        return sendError(res, 'Unauthorized access', 403);
      }

      return sendSuccess(res, request, 'Travel request retrieved successfully');
    } catch (error) {
      return sendError(res, 'Error retrieving travel request');
    }
  }

  async updateApprovalStatus(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      if (!req.user?.employeeId) {
        return sendError(res, 'Employee profile not found', 400);
      }
      const updatedRequest = await travelService.updateApprovalStatus(id as string, req.body, req.user!.employeeId as string);
      return sendSuccess(res, updatedRequest, 'Approval status updated successfully');
    } catch (error) {
      return sendError(res, 'Error updating approval status');
    }
  }

  async updateSettlement(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const updatedRequest = await travelService.updateSettlement(id as string, req.body, req.user!.userId);
      return sendSuccess(res, updatedRequest, 'Settlement updated successfully');
    } catch (error) {
      return sendError(res, 'Error updating settlement');
    }
  }
}

export const travelController = new TravelController();
