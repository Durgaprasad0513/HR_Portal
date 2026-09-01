import { Request, Response } from 'express';
import { settingsService } from './settings.service';
import { sendSuccess, sendError } from '../../utils/response';

export class SettingsController {
  getSettings = async (req: Request, res: Response) => {
    try {
      const settings = await settingsService.getSettings();
      sendSuccess(res, settings, 'Settings retrieved');
    } catch (error) {
      sendError(res, (error as Error).message);
    }
  };

  updateSettings = async (req: Request, res: Response) => {
    try {
      const settings = await settingsService.updateSettings(req.body);
      sendSuccess(res, settings, 'Settings updated');
    } catch (error) {
      sendError(res, (error as Error).message);
    }
  };
}

export const settingsController = new SettingsController();
