import { z } from 'zod';

export const createAssetSchema = z.object({
  assetType: z.enum(['LAPTOP', 'DESKTOP', 'MOBILE', 'SIM', 'ID_CARD', 'LAPTOP_BAG', 'VEHICLE', 'TOOLS', 'MACHINERY_TOOL', 'ASSET_OTHER']),
  assetCategory: z.enum(['IT', 'NON_IT', 'VEHICLE_CAT']),
  brandModel: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchaseValue: z.number().optional(),
  assignedEmployeeId: z.string().nullable().optional(),
  issueDate: z.string().optional(),
  issueCondition: z.enum(['NEW', 'GOOD', 'FAIR']).optional(),
  assetLocation: z.string().optional(),
  status: z.enum(['IN_USE', 'RETURN_REQUESTED', 'RETURNED', 'DAMAGED', 'LOST', 'RETIRED']).optional()
});

export const updateAssetSchema = createAssetSchema.partial();

export const assignAssetSchema = z.object({
  assignedEmployeeId: z.string(), // Removed uuid() because it might be CUID from Prisma
  issueCondition: z.enum(['NEW', 'GOOD', 'FAIR']).optional()
});

export const returnAssetSchema = z.object({
  returnCondition: z.enum(['RETURN_GOOD', 'RETURN_DAMAGED', 'RETURN_LOST']).optional()
});
