import { Role } from '@prisma/client';
import prisma from '../config/database';
import { hasAdminAccess } from './roles';

export type Scope = 'SELF' | 'TEAM' | 'ORG' | 'NONE';

/**
 * Determines the visibility scope for a given module/role combination.
 */
export const getModuleScope = (role: Role, _module: string): Scope => {
  if (hasAdminAccess(role)) return 'ORG';



  // DEFAULT EMPLOYEE
  return 'SELF';
};

/**
 * Helper to build a Prisma where clause for Employees based on the scope.
 */
export const getEmployeeScopeQuery = (scope: Scope, currentEmployeeId: string) => {
  switch (scope) {
    case 'ORG':
      return {}; // No restriction
    case 'TEAM':
      // They can see themselves AND people who report to them
      return {
        OR: [
          { id: currentEmployeeId },
          { managerId: currentEmployeeId }
        ]
      };
    case 'SELF':
      return { id: currentEmployeeId };
    case 'NONE':
    default:
      return { id: 'NONE' }; // Always false
  }
};
