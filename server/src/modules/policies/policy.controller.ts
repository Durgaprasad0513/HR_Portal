import { Request, Response } from 'express';
import { policyService } from './policy.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

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
      const policy = await policyService.createPolicy(req.user!.userId, req.body, { ipAddress: req.ip });
      return sendSuccess(res, policy, 'Policy created successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async updatePolicy(req: AuthRequest, res: Response) {
    try {
      const policy = await policyService.updatePolicy(req.params.id as string, req.body, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, policy, 'Policy updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async deletePolicy(req: AuthRequest, res: Response) {
    try {
      await policyService.deletePolicy(req.params.id as string, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, null, 'Policy deleted successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async acknowledgePolicy(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      
      const ack = await policyService.acknowledgePolicy(req.params.id as string, employeeId, req.body.status, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, ack, 'Policy acknowledged successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
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
