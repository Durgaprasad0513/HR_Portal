import { z } from 'zod';

export const createRequestSchema = z.object({
  requestType: z.enum(['HR_QUERY', 'LEAVE_QUERY', 'SALARY_QUERY', 'DOCUMENT_REQUEST', 'EXPERIENCE_LETTER', 'PAYSLIP', 'JOINING_DOCUMENTS', 'GENERAL', 'OTHER']),
  description: z.string().min(1, 'Description is required')
});

export const assignRequestSchema = z.object({
  assignedToId: z.string()
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'TICKET_CLOSED']),
  responseNotes: z.string().optional()
});
