import { z } from 'zod';
import { RequisitionStatus, ScreeningStatus, SelectionStatus, OfferStatus } from '@prisma/client';

export const createRequisitionSchema = z.object({
  body: z.object({
    positionTitle: z.string().min(1),
    location: z.string().min(1),
    numberOfVacancies: z.number().min(1),
    requisitionDate: z.string().transform(str => new Date(str)),
    departmentId: z.string().uuid()
  })
});

export const updateRequisitionSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createRequisitionSchema.shape.body.partial().extend({
    status: z.nativeEnum(RequisitionStatus).optional()
  })
});

export const createCandidateSchema = z.object({
  body: z.object({
    candidateName: z.string().min(1),
    mobile: z.string().min(1),
    email: z.string().email(),
    qualification: z.string().optional(),
    totalExperience: z.number().optional(),
    currentCompany: z.string().optional(),
    currentSalary: z.number().optional(),
    expectedSalary: z.number().optional(),
    noticePeriod: z.number().optional(),
    source: z.string().optional(),
    requisitionId: z.string().uuid()
  })
});

export const updateCandidateSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    screeningStatus: z.nativeEnum(ScreeningStatus).optional(),
    screeningNotes: z.string().optional(),
    interviewRound: z.string().optional(),
    interviewDate: z.string().transform(str => new Date(str)).optional(),
    interviewFeedback: z.string().optional(),
    interviewScore: z.number().optional(),
    selectionStatus: z.nativeEnum(SelectionStatus).optional(),
    offerStatus: z.nativeEnum(OfferStatus).optional(),
    offerDate: z.string().transform(str => new Date(str)).optional(),
    offeredSalary: z.number().optional(),
    joiningDate: z.string().transform(str => new Date(str)).optional(),
    interviewerId: z.string().uuid().optional()
  })
});
