import { z } from 'zod';
import { TravelMode, ApprovalStatus, SettlementStatus } from '@prisma/client';

export const createTravelRequestSchema = z.object({
  body: z.object({
    travelPurpose: z.string().min(1, 'Travel purpose is required'),
    destination: z.string().min(1, 'Destination is required'),
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
    travelMode: z.nativeEnum(TravelMode),
    advanceRequested: z.number().optional()
  })
});

export const updateApprovalStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid request ID')
  }),
  body: z.object({
    approvalStatus: z.nativeEnum(ApprovalStatus),
    advanceApproved: z.number().optional()
  })
});

export const updateSettlementSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid request ID')
  }),
  body: z.object({
    hotelExpense: z.number().optional(),
    foodAllowance: z.number().optional(),
    localConveyance: z.number().optional(),
    otherExpenses: z.number().optional(),
    totalExpenseClaimed: z.number().optional(),
    billUpload: z.string().optional(),
    amountPayable: z.number().optional(),
    settlementStatus: z.nativeEnum(SettlementStatus)
  })
});
