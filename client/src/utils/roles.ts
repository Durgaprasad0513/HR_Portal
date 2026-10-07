import type { Role } from '@/types';

export const ADMIN_ACCESS_ROLES: Role[] = ['ADMIN', 'HR', 'MANAGER'];

export const hasAdminAccess = (role?: Role | string | null) =>
  Boolean(role && ADMIN_ACCESS_ROLES.includes(role as Role));
