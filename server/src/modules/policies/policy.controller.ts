import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import { policyService } from './policy.service';

export class PolicyController {
  async getAllPolicies(req: Request, res: Response) {
    try {
      const policies = await policyService.getAllPolicies();
      return sendSuccess(res, policies, 'Policies retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async createPolicy(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return sendError(res, 'User not found', 404);
      
      const policy = await policyService.createPolicy(userId, req.body);
      return sendSuccess(res, policy, 'Policy created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async updatePolicy(req: Request, res: Response) {
    try {
      const policy = await policyService.updatePolicy(req.params.id as string, req.body);
      return sendSuccess(res, policy, 'Policy updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async deletePolicy(req: Request, res: Response) {
    try {
      await policyService.deletePolicy(req.params.id as string);
      return sendSuccess(res, null, 'Policy deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async acknowledgePolicy(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);

      const ack = await policyService.acknowledgePolicy(req.params.id as string, employeeId, req.body.acknowledgementStatus);
      return sendSuccess(res, ack, 'Policy acknowledged successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async getMyAcknowledgements(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);

      const acks = await policyService.getMyAcknowledgements(employeeId);
      return sendSuccess(res, acks, 'Acknowledgements retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async getAcknowledgementStatus(req: Request, res: Response) {
    try {
      const acks = await policyService.getAcknowledgementStatus(req.params.id as string);
      return sendSuccess(res, acks, 'Acknowledgement status retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }
}

export const policyController = new PolicyController();
