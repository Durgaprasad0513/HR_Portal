jest.mock('../src/config/database', () => {
  const db: any = { employee: { findUnique: jest.fn(), update: jest.fn(), findMany: jest.fn() }, user: { updateMany: jest.fn() }, auditLog: { create: jest.fn() } };
  db.$transaction = jest.fn((callback: any) => callback(db));
  return { __esModule: true, default: db };
});
import prisma from '../src/config/database';
import { employeeService } from '../src/modules/employees/employee.service';
import { dashboardService } from '../src/modules/dashboard/dashboard.service';

describe('inactive employees in attrition', () => {
  const admin: any = { id: 'admin', userId: 'admin', role: 'ADMIN' };
  it('records an inactive departure once and preserves its date on later edits', async () => {
    const departure = new Date('2026-10-01');
    (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ id: 'employee', status: 'ACTIVE', deactivatedAt: null });
    (prisma.employee.update as jest.Mock).mockImplementation(({ data }: any) => ({ id: 'employee', ...data }));
    const updated = await employeeService.update(admin, 'employee', { status: 'INACTIVE' });
    expect(updated.isActive).toBe(false);
    expect(updated.deactivatedAt).toBeInstanceOf(Date);
    (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ id: 'employee', status: 'INACTIVE', deactivatedAt: departure });
    const edited = await employeeService.update(admin, 'employee', { status: 'INACTIVE', firstName: 'Updated' });
    expect(edited.deactivatedAt).toEqual(departure);
  });
  it('counts legacy inactive employees without a recorded departure date', async () => {
    const today = new Date();
    (prisma.employee.findMany as jest.Mock).mockResolvedValue([{ id: 'employee', status: 'INACTIVE', joiningDate: new Date(today.getFullYear() - 2, 0, 1), updatedAt: today, department: { name: 'IT' } }]);
    const stats = await dashboardService.getAttritionStats(admin);
    expect(stats.attritionCount).toBe(1);
  });
  it('clears the departure markers when an employee is reactivated', async () => {
    (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ id: 'employee', status: 'INACTIVE', deactivatedAt: new Date(), lastWorkingDate: new Date() });
    (prisma.employee.update as jest.Mock).mockImplementation(({ data }: any) => ({ id: 'employee', ...data }));
    const updated = await employeeService.update(admin, 'employee', { status: 'ACTIVE' });
    expect(updated).toMatchObject({ isActive: true, deactivatedAt: null, lastWorkingDate: null });
  });
});
