import { z } from 'zod';

export const applyLeaveSchema = z.object({
  leaveType: z.enum(['PERSONAL', 'ON_DUTY', 'CASUAL', 'SICK', 'EARNED', 'UNPAID', 'MATERNITY', 'PATERNITY']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason must be under 500 characters'),
  isHalfDay: z.boolean().optional().default(false),
  isHourly: z.boolean().optional().default(false),
  hourlyDuration: z.number().int().min(30).max(480).optional(), // 30 min to 8 hours
});

export const updateLeaveStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  remarks: z.string().optional(),
});

export type ApplyLeaveInput = z.infer<typeof applyLeaveSchema>;
export type UpdateLeaveStatusInput = z.infer<typeof updateLeaveStatusSchema>;
