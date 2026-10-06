import { Role } from '@prisma/client';
import prisma from '../../config/database';
import {
  ACTION_FLAG,
  DEFAULT_ROLE_PERMISSIONS,
  MODULES,
  ModuleKey,
  PermissionAction,
  ROLE_LABELS,
} from './permission.catalog';
const hasLockedPermissions = (role: Role) => role === Role.ADMIN || role === Role.HR;

export class PermissionService {
  async ensureDefaults() {
    const rows = (Object.keys(DEFAULT_ROLE_PERMISSIONS) as Role[]).flatMap((role) =>
      MODULES.map((module) => ({
        role,
        module: module.key,
        ...DEFAULT_ROLE_PERMISSIONS[role][module.key],
      }))
    );

    await prisma.modulePermission.createMany({ data: rows, skipDuplicates: true });
  }

  async getForRole(role: Role) {
    await this.ensureDefaults();
    const rows = await prisma.modulePermission.findMany({
      where: { role },
      orderBy: { module: 'asc' },
    });

    if (!hasLockedPermissions(role)) return rows;

    return rows.map((row) => ({
      ...row,
      ...DEFAULT_ROLE_PERMISSIONS[Role.ADMIN][row.module as ModuleKey],
    }));
  }

  async getMatrix() {
    await this.ensureDefaults();
    const rows = await prisma.modulePermission.findMany({
      orderBy: [{ role: 'asc' }, { module: 'asc' }],
    });

    const permissions = rows.map((row) =>
      hasLockedPermissions(row.role)
        ? {
            ...row,
            ...DEFAULT_ROLE_PERMISSIONS[Role.ADMIN][row.module as ModuleKey],
          }
        : row
    );

    return {
      roles: (Object.keys(ROLE_LABELS) as Role[]).map((role) => ({
        role,
        label: ROLE_LABELS[role],
      })),
      modules: MODULES,
      permissions,
    };
  }

  async hasPermission(role: Role, module: ModuleKey, action: PermissionAction) {
    if (hasLockedPermissions(role)) return true;

    await this.ensureDefaults();
    const row = await prisma.modulePermission.findUnique({
      where: { role_module: { role, module } },
    });

    if (!row) return false;
    return Boolean(row[ACTION_FLAG[action]]);
  }

  async canViewRestricted(role: Role, module: ModuleKey) {
    if (hasLockedPermissions(role)) return true;

    await this.ensureDefaults();
    const row = await prisma.modulePermission.findUnique({
      where: { role_module: { role, module } },
    });
    return Boolean(row?.canViewRestricted);
  }

  async updatePermission(
    role: Role,
    module: string,
    flags: {
      canView?: boolean;
      canAdd?: boolean;
      canEdit?: boolean;
      canDelete?: boolean;
      canApprove?: boolean;
      canViewRestricted?: boolean;
      canExport?: boolean;
    },
    userId?: string
  ) {
    if (hasLockedPermissions(role)) {
      throw new Error('Admin and HR permissions are locked to full access');
    }
    const { canView, canAdd, canEdit, canDelete, canApprove, canViewRestricted, canExport } = flags;
    const permissionFlags = { canView, canAdd, canEdit, canDelete, canApprove, canViewRestricted, canExport };
    return prisma.modulePermission.upsert({
      where: { role_module: { role, module } },
      update: permissionFlags,
      create: {
        role,
        module,
        canView: flags.canView ?? false,
        canAdd: flags.canAdd ?? false,
        canEdit: flags.canEdit ?? false,
        canDelete: flags.canDelete ?? false,
        canApprove: flags.canApprove ?? false,
        canViewRestricted: flags.canViewRestricted ?? false,
        canExport: flags.canExport ?? false,
        createdById: userId,
      },
    });
  }
}

export const permissionService = new PermissionService();
