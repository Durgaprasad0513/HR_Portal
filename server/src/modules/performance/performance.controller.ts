import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { performanceService } from './performance.service';
import { sendSuccess, sendError } from '../../utils/response';
import { Role } from '@prisma/client';

export class PerformanceController {
  async createReview(req: AuthRequest, res: Response) {
    try {
      const review = await performanceService.createReview(req.body);
      return sendSuccess(res, review, 'Performance review created successfully', 201);
    } catch (error) {
      return sendError(res, 'Error creating performance review');
    }
  }

  async getMyReviews(req: AuthRequest, res: Response) {
    try {
      const reviews = await performanceService.getReviews({ employeeId: req.user!.employeeId as string });
      return sendSuccess(res, reviews, 'Reviews retrieved successfully');
    } catch (error) {
      return sendError(res, 'Error retrieving reviews');
    }
  }

  async getReviews(req: AuthRequest, res: Response) {
    try {
      const reviews = await performanceService.getReviews(req.query);
      return sendSuccess(res, reviews, 'Reviews retrieved successfully');
    } catch (error) {
      return sendError(res, 'Error retrieving reviews');
    }
  }

  async updateReviewRatings(req: AuthRequest, res: Response) {
    try {
      const review = await performanceService.updateReview(req.params.id as string, req.body);
      return sendSuccess(res, review, 'Review updated successfully');
    } catch (error) {
      return sendError(res, 'Error updating review');
    }
  }

  async approveReview(req: AuthRequest, res: Response) {
    try {
      const review = await performanceService.approveReview(req.params.id as string, req.body, req.user!.userId);
      return sendSuccess(res, review, 'Review approved successfully');
    } catch (error) {
      return sendError(res, 'Error approving review');
    }
  }
}

export const performanceController = new PerformanceController();
