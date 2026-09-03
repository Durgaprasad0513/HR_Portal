import { z } from 'zod';
import { MODULES } from './permission.catalog';

const moduleKeys = MODULES.map((m) => m.key) as [string, ...string[]];

export const updatePermissionSchema = z.object({
  role: z.enum(['ADMIN', 'HR', 'REMOVED_ROLE', 'MANAGER', 'EMPLOYEE']),
  module: z.enum(moduleKeys),
  canView: z.boolean().optional(),
  canAdd: z.boolean().optional(),
  canEdit: z.boolean().optional(),
  canDelete: z.boolean().optional(),
  canApprove: z.boolean().optional(),
  canViewRestricted: z.boolean().optional(),
  canExport: z.boolean().optional(),
});

export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;
