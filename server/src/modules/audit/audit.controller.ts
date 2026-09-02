import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { auditService } from './audit.service';

export class AuditController {
  async getAllLogs(req: Request, res: Response) {
    try {
      const result = await auditService.getAllLogs(req.query);
      return sendSuccess(res, result, 'Audit logs retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async getSummaryStats(_req: Request, res: Response) {
    try {
      const stats = await auditService.getSummaryStats();
      return sendSuccess(res, stats, 'Audit stats retrieved');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }

  async getModuleLogs(req: Request, res: Response) {
    try {
      const logs = await auditService.getModuleLogs(req.params.module as string);
      return sendSuccess(res, logs, 'Module audit logs retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }
}

export const auditController = new AuditController();
