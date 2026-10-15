jest.mock('../src/config/database', () => {
  const db: any = { performanceReview: { findUnique: jest.fn(), update: jest.fn() }, auditLog: { create: jest.fn() } };
  db.$transaction = jest.fn((callback: any) => callback(db));
  return { __esModule: true, default: db };
});
import prisma from '../src/config/database';
import { performanceService } from '../src/modules/performance/performance.service';
import { performanceMetricKeys } from '../src/modules/performance/performance.schema';

const metrics = Object.fromEntries(performanceMetricKeys.map(key => [key, 4]));
const manager: any = { id: 'manager-user', userId: 'manager-user', role: 'MANAGER', employeeId: 'manager-employee' };
describe('manager review submission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.performanceReview.findUnique as jest.Mock).mockResolvedValue({ id: 'review', employeeId: 'employee', status: 'MANAGER_REVIEW', employee: { managerId: null } });
    (prisma.performanceReview.update as jest.Mock).mockImplementation(({ data }: any) => ({ id: 'review', ...data }));
  });
  it('honors company-wide performance access even without a direct manager', async () => {
    const result = await performanceService.submitManagerAppraisal('review', { metricRatings: metrics }, manager);
    expect(result).toMatchObject({ status: 'FINAL_APPROVAL', managerRating: 4 });
  });
  it('prevents a manager rating their own review', async () => {
    (prisma.performanceReview.findUnique as jest.Mock).mockResolvedValue({ employeeId: manager.employeeId, status: 'MANAGER_REVIEW', employee: { managerId: null } });
    await expect(performanceService.submitManagerAppraisal('review', { metricRatings: metrics }, manager)).rejects.toThrow('own review');
    expect(prisma.performanceReview.update).not.toHaveBeenCalled();
  });
  it('rejects employee users and already locked reviews', async () => {
    await expect(performanceService.submitManagerAppraisal('review', { metricRatings: metrics }, { ...manager, role: 'EMPLOYEE' })).rejects.toThrow('Only the assigned manager');
    (prisma.performanceReview.findUnique as jest.Mock).mockResolvedValue({ employeeId: 'employee', status: 'FINAL_APPROVAL' });
    await expect(performanceService.submitManagerAppraisal('review', { metricRatings: metrics }, manager)).rejects.toThrow('locked');
  });
});
