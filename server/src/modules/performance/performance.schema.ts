import { z } from 'zod';

export const createPerformanceReviewSchema = z.object({
  employeeId: z.string(),
  reviewPeriod: z.enum(['QUARTERLY', 'HALF_YEARLY', 'ANNUAL']),
  kraDescription: z.string().optional(),
  kpiWeightage: z.number().optional(),
  goalDescription: z.string().optional(),
  targetValue: z.string().optional()
});

export const selfAppraisalSchema = z.object({
  achievedValue: z.string().optional(),
  selfRating: z.number().min(1).max(5).optional(),
  employeeComments: z.string().optional(),
  strengths: z.string().optional(),
  areasOfImprovement: z.string().optional(),
  trainingRequirement: z.string().optional()
});

export const managerAppraisalSchema = z.object({
  managerRating: z.number().min(1).max(5).optional(),
  managerComments: z.string().optional(),
  promotionRecommendation: z.boolean().optional(),
  salaryRevisionRecommendation: z.string().optional() // schema is string
});

export const hrAppraisalSchema = z.object({
  hrRating: z.number().min(1).max(5).optional(),
  hrComments: z.string().optional()
});

export const finalAppraisalSchema = z.object({
  finalRating: z.number().min(1).max(5).optional(),
  finalApprovalStatus: z.enum(['APPROVAL_PENDING', 'APPROVAL_APPROVED', 'APPROVAL_REJECTED'])
});
