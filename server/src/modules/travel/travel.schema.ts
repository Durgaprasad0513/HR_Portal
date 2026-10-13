import { z } from 'zod';

export const createTravelSchema = z.object({
  travelPurpose: z.string().min(1),
  destination: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  travelMode: z.enum(['AIR', 'TRAIN', 'ROAD', 'OWN_VEHICLE']),
  amountRequired: z.number().positive(),
  billUpload: z.string().optional()
});

export const updateApprovalSchema = z.object({
  approvalStatus: z.enum(['APPROVED', 'REJECTED', 'APPROVAL_APPROVED', 'APPROVAL_REJECTED']),
  advanceApproved: z.number().min(0).optional(),
  rejectionReason: z.string().optional()
});

export const updateSettlementSchema = z.object({
  hotelExpense: z.number().min(0).optional(),
  foodAllowance: z.number().min(0).optional(),
  localConveyance: z.number().min(0).optional(),
  otherExpenses: z.number().min(0).optional(),
  settlementStatus: z.literal('SETTLED').optional()
});

export const submitExpenseSchema = z.object({
  hotelExpense: z.number().min(0).default(0),
  foodAllowance: z.number().min(0).default(0),
  localConveyance: z.number().min(0).default(0),
  otherExpenses: z.number().min(0).default(0),
  billUpload: z.string().optional()
});
