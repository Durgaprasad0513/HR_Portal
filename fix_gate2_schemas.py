import re
import os

def strip_wrapper(path):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The schemas were generated with `z.object({ body: z.object({...}) })`.
    # Let's fix them manually.

strip_wrapper('server/src/modules/travel/travel.schema.ts')
strip_wrapper('server/src/modules/assets/asset.schema.ts')

travel_schema = """import { z } from 'zod';

export const createTravelSchema = z.object({
  travelPurpose: z.string().min(1),
  destination: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  travelMode: z.enum(['AIR', 'TRAIN', 'ROAD', 'OWN_VEHICLE']),
  advanceRequested: z.number().optional()
});

export const updateApprovalSchema = z.object({
  approvalStatus: z.enum(['APPROVAL_APPROVED', 'APPROVAL_REJECTED']),
  advanceApproved: z.number().optional(),
  rejectionReason: z.string().optional()
});

export const updateSettlementSchema = z.object({
  hotelExpense: z.number().optional(),
  foodAllowance: z.number().optional(),
  localConveyance: z.number().optional(),
  otherExpenses: z.number().optional()
});
"""

asset_schema = """import { z } from 'zod';

export const createAssetSchema = z.object({
  assetType: z.enum(['LAPTOP', 'DESKTOP', 'MOBILE', 'OTHER']),
  assetCategory: z.enum(['ELECTRONICS', 'FURNITURE', 'VEHICLE', 'OTHER']),
  brandModel: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseValue: z.number().optional()
});

export const updateAssetSchema = z.object({
  assetLocation: z.string().optional(),
  status: z.enum(['IN_USE', 'RETURNED', 'DAMAGED', 'LOST', 'RETIRED']).optional()
});

export const assignAssetSchema = z.object({
  assignedEmployeeId: z.string().uuid(),
  issueCondition: z.enum(['NEW', 'GOOD', 'FAIR']).optional()
});

export const returnAssetSchema = z.object({
  returnCondition: z.enum(['RETURN_GOOD', 'RETURN_DAMAGED', 'RETURN_LOST']).optional()
});
"""

with open('server/src/modules/travel/travel.schema.ts', 'w', encoding='utf-8') as f: f.write(travel_schema)
with open('server/src/modules/assets/asset.schema.ts', 'w', encoding='utf-8') as f: f.write(asset_schema)
