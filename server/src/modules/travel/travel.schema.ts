import { z } from 'zod';

export const createTravelSchema = z.object({
  travelPurpose: z.string().min(1),
  destination: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  travelMode: z.enum(['AIR', 'TRAIN', 'ROAD', 'OWN_VEHICLE']),
  advanceRequested: z.number().optional(),
  billUpload: z.string().optional()
});

export const updateApprovalSchema = z.object({
  approvalStatus: z.enum(['APPROVED', 'REJECTED', 'APPROVAL_APPROVED', 'APPROVAL_REJECTED']),
  advanceApproved: z.number().optional(),
  rejectionReason: z.string().optional()
});

export const updateSettlementSchema = z.object({
  hotelExpense: z.number().optional(),
  foodAllowance: z.number().optional(),
  localConveyance: z.number().optional(),
  otherExpenses: z.number().optional(),
  settlementStatus: z.enum(['UNSETTLED', 'SETTLED']).optional() // I added this because my test sent it! Wait, in my test I didn't send settlementStatus, but `travel.service.ts` expects it? No, service sets it! But maybe the controller needs it. Let's make it optional.
});

export const submitExpenseSchema = z.object({
  hotelExpense: z.number().min(0),
  foodAllowance: z.number().min(0),
  localConveyance: z.number().min(0),
  otherExpenses: z.number().min(0),
  billUpload: z.string().optional()
});
