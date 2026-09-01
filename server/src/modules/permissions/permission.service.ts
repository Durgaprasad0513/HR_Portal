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

export class PermissionService {
  async ensureDefaults() {
    const existing = await prisma.modulePermission.count();
    if (existing > 0) return;

    const rows = (Object.keys(DEFAULT_ROLE_PERMISSIONS) as Role[]).flatMap((role) =>
      MODULES.map((module) => ({
        role,
        module: module.key,
        ...DEFAULT_ROLE_PERMISSIONS[role][module.key],
      }))
    );

    await prisma.modulePermission.createMany({ data: rows });
  }

  async getForRole(role: Role) {
    await this.ensureDefaults();
    return prisma.modulePermission.findMany({
      where: { role },
      orderBy: { module: 'asc' },
    });
  }

  async getMatrix() {
    await this.ensureDefaults();
    const rows = await prisma.modulePermission.findMany({
      orderBy: [{ role: 'asc' }, { module: 'asc' }],
    });

    return {
      roles: (Object.keys(ROLE_LABELS) as Role[]).map((role) => ({
        role,
        label: ROLE_LABELS[role],
      })),
      modules: MODULES,
      permissions: rows,
    };
  }

  async hasPermission(role: Role, module: ModuleKey, action: PermissionAction) {
    if (role === Role.ADMIN) return true;

    await this.ensureDefaults();
    const row = await prisma.modulePermission.findUnique({
      where: { role_module: { role, module } },
    });

    if (!row) return false;
    return Boolean(row[ACTION_FLAG[action]]);
  }

  async canViewRestricted(role: Role, module: ModuleKey) {
    if (role === Role.ADMIN) return true;

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
    },
    userId?: string
  ) {
    return prisma.modulePermission.upsert({
      where: { role_module: { role, module } },
      update: flags,
      create: {
        role,
        module,
        canView: flags.canView ?? false,
        canAdd: flags.canAdd ?? false,
        canEdit: flags.canEdit ?? false,
        canDelete: flags.canDelete ?? false,
        canApprove: flags.canApprove ?? false,
        canViewRestricted: flags.canViewRestricted ?? false,
        createdById: userId,
      },
    });
  }
}

export const permissionService = new PermissionService();
