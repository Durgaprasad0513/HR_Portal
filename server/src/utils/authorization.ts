import { Role } from '@prisma/client';
import prisma from '../config/database';

export type Scope = 'SELF' | 'TEAM' | 'ORG' | 'NONE';

/**
 * Determines the visibility scope for a given module/role combination.
 */
export const getModuleScope = (role: Role, module: string): Scope => {
  if (role === 'ADMIN' || role === 'HR') return 'ORG';
  
  if (role === 'MANAGER') {
    // For a manager, we generally want TEAM scope for most operational modules
    // and SELF for their own profile/settings.
    const teamModules = ['employees', 'travel', 'assets', 'performance', 'training', 'requests', 'leave', 'recruitment'];
    if (teamModules.includes(module)) return 'TEAM';
    return 'SELF';
  }

  if (role === 'REMOVED_ROLE') {
    // REMOVED_ROLE might need ORG scope but with limited mutation,
    // or they might be restricted. For MVP, we'll give them ORG for operational tasks.
    const hrExecModules = ['employees', 'travel', 'assets', 'recruitment', 'performance', 'training', 'requests', 'policies'];
    if (hrExecModules.includes(module)) return 'ORG';
    return 'SELF';
  }

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
