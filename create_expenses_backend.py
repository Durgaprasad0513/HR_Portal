import os

# 1. expense.schema.ts
schema_code = """import { z } from 'zod';

export const createExpenseSchema = z.object({
  expenseDate: z.string(),
  category: z.enum(['STATIONERY', 'FOOD_SNACKS', 'MAINTENANCE', 'UTILITIES', 'IT_SOFTWARE', 'OTHER']),
  description: z.string().min(1),
  amount: z.number().min(0),
  billUpload: z.string().optional(),
});

export const updateExpenseStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'PAID']),
});
"""
with open("server/src/modules/expenses/expense.schema.ts", "w", encoding="utf-8") as f:
    f.write(schema_code)

# 2. expense.service.ts
service_code = """import { PrismaClient, ExpenseStatus } from '@prisma/client';
import { getModuleScope } from '../../utils/authorization';

const prisma = new PrismaClient();

interface CurrentUser {
  id: string;
  role: string;
  employeeId?: string;
}

export class ExpenseService {
  async getAll(currentUser: CurrentUser, query: any) {
    const scope = getModuleScope(currentUser.role as any, 'office_expenses');
    
    // If not ORG scope, they can only see their own submissions
    const whereClause: any = {};
    if (scope !== 'ORG') {
      if (!currentUser.employeeId) throw new Error('Not authorized');
      whereClause.submittedById = currentUser.employeeId;
    }

    return prisma.officeExpense.findMany({
      where: whereClause,
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true } },
        approvedBy: { select: { id: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(currentUser: CurrentUser, data: any) {
    if (!currentUser.employeeId) throw new Error('Employee ID required to submit expense');

    return prisma.officeExpense.create({
      data: {
        expenseDate: new Date(data.expenseDate),
        category: data.category,
        description: data.description,
        amount: data.amount,
        billUpload: data.billUpload,
        submittedById: currentUser.employeeId,
      }
    });
  }

  async updateStatus(currentUser: CurrentUser, id: string, data: any) {
    const scope = getModuleScope(currentUser.role as any, 'office_expenses');
    if (scope !== 'ORG') throw new Error('Not authorized to approve expenses');
    if (!currentUser.employeeId) throw new Error('Employee ID required to approve expense');

    return prisma.officeExpense.update({
      where: { id },
      data: {
        status: data.status,
        approvedById: currentUser.employeeId
      }
    });
  }
}

export const expenseService = new ExpenseService();
"""
with open("server/src/modules/expenses/expense.service.ts", "w", encoding="utf-8") as f:
    f.write(service_code)

# 3. expense.controller.ts
controller_code = """import { Request, Response } from 'express';
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
"""
with open("server/src/modules/expenses/expense.controller.ts", "w", encoding="utf-8") as f:
    f.write(controller_code)

# 4. expense.routes.ts
routes_code = """import { Router } from 'express';
import { expenseController } from './expense.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { createExpenseSchema, updateExpenseStatusSchema } from './expense.schema';

const router = Router();

router.use(authenticate);

// No strict requirePermission middleware since employees need to submit, 
// we will rely on service-level scope checks.
router.get('/', (req, res) => expenseController.getAll(req, res));
router.post('/', validateRequest({ body: createExpenseSchema }), (req, res) => expenseController.create(req, res));
router.patch('/:id/status', validateRequest({ body: updateExpenseStatusSchema }), (req, res) => expenseController.updateStatus(req, res));

export default router;
"""
with open("server/src/modules/expenses/expense.routes.ts", "w", encoding="utf-8") as f:
    f.write(routes_code)

print("Created expenses backend module")
