jest.mock('../src/config/database', () => {
  const models = ['employee', 'performanceReview', 'requisition', 'candidate', 'leave', 'travelRequest', 'officeExpense', 'training', 'asset', 'interview'];
  return { __esModule: true, default: Object.fromEntries(models.map(name => [name, {
    count: jest.fn().mockResolvedValue(0), findMany: jest.fn().mockResolvedValue([]),
  }])) };
});

import prisma from '../src/config/database';
import { dashboardService } from '../src/modules/dashboard/dashboard.service';

describe('dashboard performance attention scope', () => {
  it('includes the pending manager review visible in the company review register', async () => {
    const review = { id: 'review-1', reviewPeriod: 'MONTHLY', createdAt: new Date(), employee: { firstName: 'Test', lastName: 'Employee' } };
    const findMany = prisma.performanceReview.findMany as jest.Mock;
    // This employee is visible in the company register but is not a direct report.
    findMany.mockImplementation(async ({ where }) => where.employee?.managerId ? [] : [review]);
    const stats = await dashboardService.getStats({ userId: 'manager-user', role: 'MANAGER', employeeId: 'manager-employee' });
    expect(stats.needsAttention).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'perf-review-1', module: 'Performance', link: '/performance' })]));
    expect(findMany.mock.calls[0][0].where).toEqual({ status: { in: ['MANAGER_REVIEW', 'FINAL_APPROVAL'] } });
  });

  it('keeps employee attention restricted to their own self-review', async () => {
    await dashboardService.getStats({ userId: 'employee-user', role: 'EMPLOYEE', employeeId: 'employee-1' });
    expect(prisma.performanceReview.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { status: { in: ['EMPLOYEE_REVIEW'] }, employeeId: 'employee-1' },
    }));
  });
});
