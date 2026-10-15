jest.mock('../src/config/database', () => {
  const db: any = {
    employee: { create: jest.fn() },
    user: { create: jest.fn() },
    auditLog: { create: jest.fn() },
  };
  db.$transaction = jest.fn((callback: any) => callback(db));
  return { __esModule: true, default: db };
});
jest.mock('../src/utils/password', () => ({ hashPassword: jest.fn().mockResolvedValue('hashed-password') }));

import prisma from '../src/config/database';
import { userManagementService } from '../src/modules/users/user.service';

describe('role management account creation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.employee.create as jest.Mock).mockResolvedValue({ id: 'employee-1' });
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 'user-1', email: 'person@example.com', role: 'MANAGER', isActive: true });
  });

  it('creates a linked employee using only the account name and email', async () => {
    await userManagementService.createUser({ name: 'Ada Lovelace', email: 'person@example.com', password: 'secret1', role: 'MANAGER' }, 'admin-1');

    expect(prisma.employee.create).toHaveBeenCalledWith({ data: expect.objectContaining({
      firstName: 'Ada', lastName: 'Lovelace', email: 'person@example.com', designation: 'Not specified',
      employeeCode: expect.stringMatching(/^USR-[A-F0-9]{10}$/), joiningDate: expect.any(Date),
    }) });
    expect(prisma.user.create).toHaveBeenCalledWith({ data: expect.objectContaining({ email: 'person@example.com', employeeId: 'employee-1', role: 'MANAGER' }) });
    expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
  });

  it('rejects a missing name before creating records', async () => {
    await expect(userManagementService.createUser({ name: '  ', email: 'person@example.com', password: 'secret1', role: 'MANAGER' }, 'admin-1')).rejects.toThrow('Name is required');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('rejects an invalid email before creating records', async () => {
    await expect(userManagementService.createUser({ name: 'Ada Lovelace', email: 'not-an-email', password: 'secret1', role: 'MANAGER' }, 'admin-1')).rejects.toThrow('valid email');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
