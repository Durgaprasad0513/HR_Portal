import { Role } from '@prisma/client';
import { Response } from 'express';
import { requirePermission, AuthRequest } from '../src/middleware/auth.middleware';
import { permissionService } from '../src/modules/permissions/permission.service';
import { ACTION_FLAG, DEFAULT_ROLE_PERMISSIONS, MODULES, PermissionAction, ModuleKey } from '../src/modules/permissions/permission.catalog';

describe('Manager and Employee permission matrix', () => {
  const roles = [Role.MANAGER, Role.EMPLOYEE];
  const actions = Object.keys(ACTION_FLAG) as PermissionAction[];

  afterEach(() => jest.restoreAllMocks());

  test.each(roles)('%s: every module and action is enforced by the API guard', async (role) => {
    const matrix = DEFAULT_ROLE_PERMISSIONS[role];
    const hasPermission = jest.spyOn(permissionService, 'hasPermission').mockImplementation(
      async (_role, module, action) => matrix[module][ACTION_FLAG[action]]
    );

    for (const { key: module } of MODULES) {
      for (const action of actions) {
        const request = { user: { role } } as AuthRequest;
        const response = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() } as unknown as Response;
        const next = jest.fn();
        await requirePermission(module, action)(request, response, next);
        const expected = matrix[module].canView && matrix[module][ACTION_FLAG[action]];
        expect(next).toHaveBeenCalledTimes(expected ? 1 : 0);
        if (!expected) expect(response.status).toHaveBeenCalledWith(403);
      }
    }
    expect(hasPermission).toHaveBeenCalled();
  });

  test.each(roles)('%s: revoked view blocks other permissions, even when action is enabled', async (role) => {
    jest.spyOn(permissionService, 'hasPermission').mockImplementation(async (_role, _module, action) => action !== 'view');
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() } as unknown as Response;
    for (const action of actions.filter((value) => value !== 'view')) {
      const next = jest.fn();
      await requirePermission('assets', action)({ user: { role } } as AuthRequest, response, next);
      expect(next).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(403);
    }
  });

  test.each(roles)('%s: changed matrix flags take effect for every module', async (role) => {
    const permissions = Object.fromEntries(MODULES.map(({ key }) => [key, { view: true, add: false }])) as Record<ModuleKey, Record<'view' | 'add', boolean>>;
    jest.spyOn(permissionService, 'hasPermission').mockImplementation(async (_role, module, action) => permissions[module][action as 'view' | 'add'] ?? false);
    for (const { key: module } of MODULES) {
      const request = { user: { role } } as AuthRequest;
      const response = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() } as unknown as Response;
      const denied = jest.fn();
      await requirePermission(module, 'add')(request, response, denied);
      expect(denied).not.toHaveBeenCalled();
      permissions[module].add = true;
      const allowed = jest.fn();
      await requirePermission(module, 'add')(request, response, allowed);
      expect(allowed).toHaveBeenCalledTimes(1);
      permissions[module].add = false;
    }
  });
});
