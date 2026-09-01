import { Request, Response } from 'express';
import { documentService } from './document.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth.middleware';

export class DocumentController {
  async upload(req: AuthRequest, res: Response) {
    try {
      if (!req.file) return sendError(res, 'No file provided', 400);
      const doc = await documentService.upload(req.user, req.file, req.body, { ipAddress: req.ip });
      return sendSuccess(res, doc, 'Document uploaded successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async getEmployeeDocuments(req: AuthRequest, res: Response) {
    try {
      const docs = await documentService.getEmployeeDocuments(req.params.employeeId as string, req.user, { ipAddress: req.ip });
      return sendSuccess(res, docs, 'Documents retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 403);
    }
  }

  async generateDownloadLink(req: AuthRequest, res: Response) {
    try {
      const link = await documentService.generateDownloadLink(req.params.id as string, req.user, { ipAddress: req.ip });
      return sendSuccess(res, link, 'Download link generated');
    } catch (error: any) {
      return sendError(res, error.message, 403);
    }
  }
}

export const documentController = new DocumentController();
