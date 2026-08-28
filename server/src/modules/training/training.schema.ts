import { z } from 'zod';

export const createTrainingSchema = z.object({
  body: z.object({
    trainingTopic: z.string().min(1, 'Training topic is required'),
    trainingType: z.enum(['TECHNICAL', 'SOFT_SKILLS', 'COMPLIANCE', 'OTHER']),
    trainerName: z.string().optional(),
    trainingDate: z.string().datetime(),
    trainingLocation: z.string().optional(),
    trainingCost: z.number().optional(),
    trainingHours: z.number().optional(),
    targetDepartmentId: z.string().optional()
  })
});

export const updateTrainingSchema = z.object({
  body: createTrainingSchema.shape.body.partial(),
  params: z.object({
    id: z.string().uuid()
  })
});

export const addParticipantSchema = z.object({
  body: z.object({
    employeeId: z.string().uuid()
  }),
  params: z.object({
    id: z.string().uuid()
  })
});

export const updateParticipantSchema = z.object({
  body: z.object({
    attendanceStatus: z.enum(['TRAINING_PRESENT', 'TRAINING_ABSENT', 'EXCUSED']).optional(),
    feedbackRating: z.number().min(1).max(5).optional(),
    feedbackComments: z.string().optional(),
    assessmentScore: z.number().optional(),
    certificateIssued: z.boolean().optional(),
    certificateFile: z.string().optional()
  }),
  params: z.object({
    id: z.string().uuid(),
    employeeId: z.string().uuid()
  })
});
