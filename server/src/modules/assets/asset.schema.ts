import { z } from 'zod';
import { AssetType, AssetCategory, AssetCondition, AssetReturnCondition } from '@prisma/client';

export const createAssetSchema = z.object({
  body: z.object({
    assetType: z.nativeEnum(AssetType),
    assetCategory: z.nativeEnum(AssetCategory),
    brandModel: z.string().min(1, 'Brand/Model is required'),
    serialNumber: z.string().min(1, 'Serial number is required'),
    purchaseDate: z.string().transform((str) => new Date(str)),
    purchaseValue: z.number().min(0),
    vendor: z.string().optional(),
    warrantyExpiryDate: z.string().transform((str) => new Date(str)).optional(),
    remarks: z.string().optional()
  })
});

export const updateAssetSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createAssetSchema.shape.body.partial()
});

export const assignAssetSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    assignedEmployeeId: z.string().uuid('Invalid employee ID'),
    issueDate: z.string().transform((str) => new Date(str)),
    issueCondition: z.nativeEnum(AssetCondition),
    assetLocation: z.string().optional()
  })
});

export const returnAssetSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    returnDate: z.string().transform((str) => new Date(str)),
    returnCondition: z.nativeEnum(AssetReturnCondition),
    remarks: z.string().optional()
  })
});
