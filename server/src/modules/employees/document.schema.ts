import { z } from 'zod';

export const uploadDocumentSchema = z.object({
  documentType: z.enum(['GOVERNMENT_ID', 'EDUCATION', 'CONTRACT', 'OTHER']),
  documentName: z.string().min(1, 'Document name is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
});
