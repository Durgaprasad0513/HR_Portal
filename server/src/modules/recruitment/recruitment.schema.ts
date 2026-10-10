import { z } from 'zod';
const interviewRoundSchema = z.enum(['TELEPHONIC', 'HR_INTERVIEW', 'TECHNICAL', 'MANAGEMENT', 'OFFER']);
const dateSchema = z.string().datetime({ offset: true });

export const createRequisitionSchema = z.object({
  positionTitle: z.string().min(1),
  location: z.string().min(1),
  numberOfVacancies: z.number().int().min(1),
  requisitionDate: dateSchema.optional(),
  departmentId: z.string()
});

export const updateRequisitionSchema = z.object({
  positionTitle: z.string().trim().min(1).optional(),
  departmentId: z.string().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  numberOfVacancies: z.number().int().min(1).optional()
});

export const updateRequisitionStatusSchema = z.object({
  status: z.enum(['REQUIREMENT', 'SOURCING', 'SCREENING', 'TELEPHONIC', 'HR_INTERVIEW', 'TECHNICAL', 'MANAGEMENT', 'SELECTED', 'OFFER', 'JOINED_REJECTED', 'CLOSED'])
});

export const createCandidateSchema = z.object({
  candidateName: z.string().min(1),
  mobile: z.string().optional(),
  email: z.string().email().optional(),
  qualification: z.string().optional(),
  totalExperience: z.number().optional(),
  currentCompany: z.string().optional(),
  currentSalary: z.number().optional(),
  expectedSalary: z.number().optional(),
  noticePeriod: z.number().optional(),
  source: z.string().optional(),
  requisitionId: z.string(),
  interviewDate: dateSchema.optional(),
  screeningStatus: z.enum(['SCREENING_PENDING', 'SHORTLISTED', 'SCREENING_REJECTED']).optional(),
  interviewerId: z.string().optional(),
  interviewRound: interviewRoundSchema.optional(),
  interviewLocation: z.string().optional(),
});

export const screenCandidateSchema = z.object({
  screeningStatus: z.enum(['SCREENING_PENDING', 'SHORTLISTED', 'SCREENING_REJECTED']),
  screeningNotes: z.string().optional()
});

export const interviewCandidateSchema = z.object({
  interviewRound: interviewRoundSchema.optional(),
  interviewDate: dateSchema.optional(),
  interviewLocation: z.string().trim().min(1).optional(),
  interviewFeedback: z.string().optional(),
  interviewScore: z.number().int().min(0).optional(),
  selectionStatus: z.enum(['SELECTED', 'SELECTION_REJECTED', 'SELECTION_ON_HOLD']).nullable().optional(),
  interviewerId: z.string().optional()
});

export const offerCandidateSchema = z.object({
  offerStatus: z.enum(['NOT_RELEASED', 'RELEASED', 'OFFER_ACCEPTED', 'OFFER_DECLINED']),
  offerDate: dateSchema.optional(),
  offeredSalary: z.number().min(0).optional(),
  joiningDate: dateSchema.optional()
});

