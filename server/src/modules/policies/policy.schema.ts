import { z } from 'zod';

export const createPolicySchema = z.object({
  policyName: z.string().min(1, 'Policy Name is required'),
  policyCategory: z.enum([
    'HR_POLICY', 'LEAVE_POLICY', 'ATTENDANCE_POLICY', 'TRAVEL_POLICY', 'CODE_OF_CONDUCT', 'EMPLOYEE_HANDBOOK', 
    'RECRUITMENT_POLICY', 'PERFORMANCE_POLICY', 'TRAINING_POLICY', 'POSH', 'SAFETY', 'CIRCULAR', 'FORM', 'SOP'
  ]),
  versionNumber: z.string().default('v1.0'),
  filePath: z.string().min(1, 'File attachment is required'),
  acknowledgementRequired: z.boolean().default(false)
});

export const updatePolicySchema = z.object({
  policyName: z.string().optional(),
  policyCategory: z.enum([
    'HR_POLICY', 'LEAVE_POLICY', 'ATTENDANCE_POLICY', 'TRAVEL_POLICY', 'CODE_OF_CONDUCT', 'EMPLOYEE_HANDBOOK', 
    'RECRUITMENT_POLICY', 'PERFORMANCE_POLICY', 'TRAINING_POLICY', 'POSH', 'SAFETY', 'CIRCULAR', 'FORM', 'SOP'
  ]).optional(),
  versionNumber: z.string().optional(),
  filePath: z.string().optional(),
  acknowledgementRequired: z.boolean().optional()
});

export const acknowledgePolicySchema = z.object({
  status: z.enum(['ACKNOWLEDGED'])
});
