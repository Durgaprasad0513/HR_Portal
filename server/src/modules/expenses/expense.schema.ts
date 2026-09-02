import { z } from 'zod';

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
