import { Request, Response } from 'express';
import { recruitmentService } from './recruitment.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export class RecruitmentController {
  async createRequisition(req: AuthRequest, res: Response) {
    try {
      const result = await recruitmentService.createRequisition(req.body, req.user!.employeeId!, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, result, 'Requisition created successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async getRequisitions(req: AuthRequest, res: Response) {
    try {
      const result = await recruitmentService.getRequisitions(req.user!, req.query);
      return sendSuccess(res, result, 'Requisitions retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async updateRequisitionStatus(req: AuthRequest, res: Response) {
    try {
      const result = await recruitmentService.updateRequisitionStatus(req.params.id as string, req.body, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, result, 'Requisition status updated');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async createCandidate(req: AuthRequest, res: Response) {
    try {
      const result = await recruitmentService.createCandidate(req.body, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, result, 'Candidate created successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async getCandidatesByRequisition(req: AuthRequest, res: Response) {
    try {
      const result = await recruitmentService.getCandidatesByRequisition(req.params.reqId as string, req.user!);
      return sendSuccess(res, result, 'Candidates retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async screenCandidate(req: AuthRequest, res: Response) {
    try {
      const result = await recruitmentService.screenCandidate(req.params.id as string, req.body, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, result, 'Candidate screened successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async interviewCandidate(req: AuthRequest, res: Response) {
    try {
      const result = await recruitmentService.interviewCandidate(req.params.id as string, req.body, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, result, 'Candidate interviewed successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async offerCandidate(req: AuthRequest, res: Response) {
    try {
      const result = await recruitmentService.offerCandidate(req.params.id as string, req.body, req.user!.userId, { ipAddress: req.ip });
      return sendSuccess(res, result, 'Candidate offer status updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }
}

export const recruitmentController = new RecruitmentController();
