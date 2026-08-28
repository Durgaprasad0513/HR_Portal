import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';
import { trainingService } from './training.service';

export class TrainingController {
  async getAllTrainings(req: Request, res: Response) {
    try {
      const trainings = await trainingService.getAllTrainings(req.query);
      return sendSuccess(res, trainings, 'Trainings retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async getMyTrainings(req: AuthRequest, res: Response) {
    try {
      const employeeId = req.user?.employeeId;
      if (!employeeId) return sendError(res, 'Employee not found', 404);
      const trainings = await trainingService.getMyTrainings(employeeId);
      return sendSuccess(res, trainings, 'My trainings retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async createTraining(req: Request, res: Response) {
    try {
      const training = await trainingService.createTraining(req.body);
      return sendSuccess(res, training, 'Training created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async updateTraining(req: Request, res: Response) {
    try {
      const training = await trainingService.updateTraining(req.params.id as string, req.body);
      return sendSuccess(res, training, 'Training updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async addParticipant(req: Request, res: Response) {
    try {
      const participant = await trainingService.addParticipant(req.params.id as string, req.body.employeeId);
      return sendSuccess(res, participant, 'Participant added successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async removeParticipant(req: Request, res: Response) {
    try {
      await trainingService.removeParticipant(req.params.id as string, req.params.employeeId as string);
      return sendSuccess(res, null, 'Participant removed successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async updateParticipant(req: Request, res: Response) {
    try {
      const participant = await trainingService.updateParticipant(req.params.id as string, req.params.employeeId as string, req.body);
      return sendSuccess(res, participant, 'Participant updated successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }
}

export const trainingController = new TrainingController();
