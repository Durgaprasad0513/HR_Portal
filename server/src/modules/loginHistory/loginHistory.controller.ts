import { Request, Response } from 'express';
import { loginHistoryService } from './loginHistory.service';
import { sendSuccess, sendError } from '../../utils/response';

export class LoginHistoryController {
  getAllHistory = async (req: Request, res: Response) => {
    try {
      const history = await loginHistoryService.getAllHistory();
      sendSuccess(res, history, 'Login history retrieved');
    } catch (error) {
      sendError(res, (error as Error).message);
    }
  };
}

export const loginHistoryController = new LoginHistoryController();
