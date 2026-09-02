import { z } from 'zod';

export const uploadDocumentSchema = z.object({
  documentType: z.enum(['RESUME', 'AADHAAR', 'PAN', 'EDUCATIONAL_CERTIFICATE', 'EXPERIENCE_CERTIFICATE', 'APPOINTMENT_LETTER', 'OTHER']),
  documentName: z.string().min(1, 'Document name is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
});
