import { z } from 'zod';
import { ReviewPeriod, ApprovalStatus } from '@prisma/client';

export const createPerformanceReviewSchema = z.object({
  body: z.object({
    employeeId: z.string().uuid(),
    reviewPeriod: z.nativeEnum(ReviewPeriod),
    kraDescription: z.string().optional(),
    kpiWeightage: z.number().optional(),
    goalDescription: z.string().optional(),
    targetValue: z.number().optional()
  })
});

export const updateReviewRatingsSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    achievedValue: z.number().optional(),
    selfRating: z.number().optional(),
    managerRating: z.number().optional(),
    hrRating: z.number().optional(),
    finalRating: z.number().optional(),
    managerComments: z.string().optional(),
    employeeComments: z.string().optional(),
    hrComments: z.string().optional(),
    strengths: z.string().optional(),
    areasOfImprovement: z.string().optional(),
    trainingRequirement: z.string().optional(),
    promotionRecommendation: z.boolean().optional(),
    salaryRevisionRecommendation: z.boolean().optional()
  })
});

export const approveReviewSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    finalApprovalStatus: z.nativeEnum(ApprovalStatus)
  })
});
