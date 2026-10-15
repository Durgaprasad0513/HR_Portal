jest.mock('../src/config/database', () => {
  const db: any = {
    user: { findUnique: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
    employee: { update: jest.fn() },
    employeeRequest: { update: jest.fn() },
    auditLog: { create: jest.fn() },
  };
  db.$transaction = jest.fn((callback: any) => callback(db));
  return { __esModule: true, default: db };
});
jest.mock('../src/modules/notifications/notification.service', () => ({ notificationService: {} }));

import prisma from '../src/config/database';
import { userManagementService } from '../src/modules/users/user.service';
import { requestService } from '../src/modules/requests/request.service';

describe('user removal and staff assignment', () => {
  const account = {
    id: 'user-1', email: 'staff@example.com', role: 'HR', deletedAt: null,
    employee: { id: 'employee-1', employeeCode: 'USR-ABC123' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(account);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
  });

  it('blocks removal of the acting account before any lookup or write', async () => {
    await expect(userManagementService.removeUser('admin-1', 'admin-1')).rejects.toThrow('own account');
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('blocks removal of an administrator without writes', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ ...account, role: 'ADMIN' });
    await expect(userManagementService.removeUser(account.id, 'admin-1')).rejects.toThrow('Administrator accounts');
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it('soft deletes staff, invalidates sessions, deactivates their placeholder, and retains an audit record', async () => {
    await userManagementService.removeUser(account.id, 'admin-1');
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    const update = (prisma.user.update as jest.Mock).mock.calls[0][0];
    expect(update).toEqual({ where: { id: account.id }, data: {
      deletedAt: expect.any(Date), deactivatedAt: expect.any(Date),
      isActive: false, tokenVersion: { increment: 1 },
    } });
    expect(update.data.deactivatedAt).toEqual(update.data.deletedAt);
    expect(prisma.employee.update).toHaveBeenCalledWith({ where: { id: 'employee-1' }, data: {
      isActive: false, status: 'INACTIVE', deactivatedAt: update.data.deletedAt,
    } });
    expect(prisma.auditLog.create).toHaveBeenCalledWith({ data: {
      actionPerformed: 'REMOVE_USER', moduleAffected: 'roles', recordIdAffected: account.id,
      oldValue: JSON.stringify({ email: account.email, role: account.role }), userId: 'admin-1',
    } });
  });

  it.each([
    { id: 'employee-1', employeeCode: 'EMP-123' },
    null,
  ])('preserves regular employees and supports accounts without an employee: %p', async (employee) => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ ...account, employee });
    await userManagementService.removeUser(account.id, 'admin-1');
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    expect(prisma.employee.update).not.toHaveBeenCalled();
    expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
  });

  it.each([null, { ...account, deletedAt: new Date('2026-10-15T00:00:00Z') }])(
    'rejects missing or already removed users without mutation: %p', async (user) => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      await expect(userManagementService.removeUser(account.id, 'admin-1')).rejects.toThrow('User not found');
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(prisma.user.update).not.toHaveBeenCalled();
    },
  );

  it('rejects removed or inactive staff as assignees before changing a request', async () => {
    await expect(requestService.assignRequest('request-1', account.id, 'admin-1')).rejects.toThrow('active staff user');
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { id: account.id, isActive: true, deletedAt: null, role: { in: ['ADMIN', 'HR', 'MANAGER'] } },
      select: { id: true },
    });
    expect(prisma.employeeRequest.update).not.toHaveBeenCalled();
    expect(prisma.auditLog.create).not.toHaveBeenCalled();
  });

  it('continues assigning requests to eligible active staff', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: account.id });
    (prisma.employeeRequest.update as jest.Mock).mockResolvedValue({ id: 'request-1', assignedToId: account.id });
    await expect(requestService.assignRequest('request-1', account.id, 'admin-1')).resolves.toEqual({
      id: 'request-1', assignedToId: account.id,
    });
    expect(prisma.employeeRequest.update).toHaveBeenCalledWith({ where: { id: 'request-1' }, data: { assignedToId: account.id } });
    expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
  });
});
