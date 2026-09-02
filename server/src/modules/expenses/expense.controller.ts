import { Request, Response } from 'express';
import { expenseService } from './expense.service';

export class ExpenseController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await expenseService.getAll(req.user, req.query);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(403).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await expenseService.create(req.user, req.body);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const data = await expenseService.updateStatus(req.user, req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(403).json({ success: false, message: error.message });
    }
  }
}

export const expenseController = new ExpenseController();
