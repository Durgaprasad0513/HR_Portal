import { z } from 'zod';

export const createPolicySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  version: z.string().min(1),
  isRequired: z.boolean().default(false)
});

export const updatePolicySchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  version: z.string().optional(),
  isRequired: z.boolean().optional()
});

export const acknowledgePolicySchema = z.object({
  status: z.enum(['ACKNOWLEDGED'])
});
