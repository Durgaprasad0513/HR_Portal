import { z } from 'zod';

export const createRequestSchema = z.object({
  requestType: z.enum(['LEAVE_QUERY', 'SALARY_QUERY', 'DOCUMENT_REQUEST', 'EXPERIENCE_LETTER', 'PAYSLIP']),
  description: z.string().min(1, 'Description is required')
});

export const assignRequestSchema = z.object({
  assignedToId: z.string().uuid()
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  responseNotes: z.string().optional()
});
