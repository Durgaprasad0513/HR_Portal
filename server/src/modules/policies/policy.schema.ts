import { z } from 'zod';

export const createPolicySchema = z.object({
  body: z.object({
    policyName: z.string().min(1, 'Policy name is required'),
    policyCategory: z.enum(['HR', 'IT', 'FINANCE', 'GENERAL']),
    versionNumber: z.string().min(1, 'Version is required'),
    filePath: z.string().min(1, 'File path is required'),
    applicableTo: z.string().optional(),
    acknowledgementRequired: z.boolean().optional()
  })
});

export const updatePolicySchema = z.object({
  body: createPolicySchema.shape.body.partial(),
  params: z.object({
    id: z.string().uuid()
  })
});

export const acknowledgePolicySchema = z.object({
  body: z.object({
    acknowledgementStatus: z.enum(['ACK_PENDING', 'ACKNOWLEDGED'])
  }),
  params: z.object({
    id: z.string().uuid()
  })
});
