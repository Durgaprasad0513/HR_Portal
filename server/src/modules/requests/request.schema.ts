import { z } from 'zod';

export const createRequestSchema = z.object({
  body: z.object({
    requestType: z.enum(['LEAVE', 'EQUIPMENT', 'PAYROLL', 'OTHER']),
    description: z.string().min(1, 'Description is required')
  })
});

export const assignRequestSchema = z.object({
  body: z.object({
    assignedToId: z.string().uuid()
  }),
  params: z.object({
    id: z.string().uuid()
  })
});

export const updateRequestStatusSchema = z.object({
  body: z.object({
    status: z.enum(['SUBMITTED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
    responseNotes: z.string().optional()
  }),
  params: z.object({
    id: z.string().uuid()
  })
});
