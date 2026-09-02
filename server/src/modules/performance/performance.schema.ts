import { z } from 'zod';

export const createPerformanceReviewSchema = z.object({
  employeeId: z.string(),
  reviewPeriod: z.enum(['QUARTERLY', 'HALF_YEARLY', 'ANNUAL']),
  kraDescription: z.string().nullish(),
  kpiWeightage: z.coerce.number().nullish(),
  goalDescription: z.string().nullish(),
  targetValue: z.string().nullish()
});

export const updatePerformanceReviewSchema = z.object({
  reviewPeriod: z.enum(['QUARTERLY', 'HALF_YEARLY', 'ANNUAL']),
  kraDescription: z.string().nullish(),
  kpiWeightage: z.coerce.number().nullish(),
  goalDescription: z.string().nullish(),
  targetValue: z.string().nullish()
});

export const selfAppraisalSchema = z.object({
  achievedValue: z.string().nullish(),
  selfRating: z.coerce.number().min(1).max(5).nullish(),
  employeeComments: z.string().nullish(),
  strengths: z.string().nullish(),
  areasOfImprovement: z.string().nullish(),
  trainingRequirement: z.string().nullish()
});

export const managerAppraisalSchema = z.object({
  managerRating: z.coerce.number().min(1).max(5).nullish(),
  managerComments: z.string().nullish(),
  promotionRecommendation: z.boolean().nullish(),
  salaryRevisionRecommendation: z.string().nullish()
});

export const hrAppraisalSchema = z.object({
  hrRating: z.coerce.number().min(1).max(5).nullish(),
  hrComments: z.string().nullish()
});

export const finalAppraisalSchema = z.object({
  finalRating: z.coerce.number().min(1).max(5).nullish(),
  finalApprovalStatus: z.enum(['APPROVAL_PENDING', 'APPROVAL_APPROVED', 'APPROVAL_REJECTED']).nullish()
});
