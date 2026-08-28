import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { recruitmentService } from './recruitment.service';
import { sendSuccess, sendError } from '../../utils/response';

export class RecruitmentController {
  async createRequisition(req: AuthRequest, res: Response) {
    try {
      const requisition = await recruitmentService.createRequisition(req.body, req.user!.userId);
      return sendSuccess(res, requisition, 'Requisition created successfully', 201);
    } catch (error) {
      return sendError(res, 'Error creating requisition');
    }
  }

  async getRequisitions(req: AuthRequest, res: Response) {
    try {
      const requisitions = await recruitmentService.getRequisitions(req.query);
      return sendSuccess(res, requisitions, 'Requisitions retrieved successfully');
    } catch (error) {
      return sendError(res, 'Error retrieving requisitions');
    }
  }

  async updateRequisition(req: AuthRequest, res: Response) {
    try {
      const requisition = await recruitmentService.updateRequisition(req.params.id as string, req.body);
      return sendSuccess(res, requisition, 'Requisition updated successfully');
    } catch (error) {
      return sendError(res, 'Error updating requisition');
    }
  }

  async createCandidate(req: AuthRequest, res: Response) {
    try {
      const candidate = await recruitmentService.createCandidate(req.body);
      return sendSuccess(res, candidate, 'Candidate created successfully', 201);
    } catch (error) {
      return sendError(res, 'Error creating candidate');
    }
  }

  async getCandidatesByRequisition(req: AuthRequest, res: Response) {
    try {
      const candidates = await recruitmentService.getCandidatesByRequisition(req.params.requisitionId as string);
      return sendSuccess(res, candidates, 'Candidates retrieved successfully');
    } catch (error) {
      return sendError(res, 'Error retrieving candidates');
    }
  }

  async updateCandidate(req: AuthRequest, res: Response) {
    try {
      const candidate = await recruitmentService.updateCandidate(req.params.id as string, req.body);
      return sendSuccess(res, candidate, 'Candidate updated successfully');
    } catch (error) {
      return sendError(res, 'Error updating candidate');
    }
  }
}

export const recruitmentController = new RecruitmentController();
