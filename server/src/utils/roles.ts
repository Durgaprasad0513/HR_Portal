import { Role } from '@prisma/client';

export const ADMIN_ACCESS_ROLES: Role[] = [Role.ADMIN, Role.HR, Role.MANAGER];

export const hasAdminAccess = (role?: Role | string | null) =>
  Boolean(role && ADMIN_ACCESS_ROLES.includes(role as Role));
