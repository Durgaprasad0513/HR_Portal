import { Prisma } from '@prisma/client';
import prisma from '../src/config/database';
import { travelService } from '../src/modules/travel/travel.service';

jest.mock('../src/config/database', () => ({
  __esModule: true,
  default: {
    travelRequest: { findUnique: jest.fn(), update: jest.fn() },
    $transaction: jest.fn(),
  },
}));

describe('Travel settlement money calculations', () => {
  const fixture = {
    hotelExpense: new Prisma.Decimal(100),
    foodAllowance: new Prisma.Decimal(500),
    localConveyance: new Prisma.Decimal(400),
    otherExpenses: new Prisma.Decimal(100),
    totalExpenseClaimed: new Prisma.Decimal('100500400100'),
    advanceApproved: new Prisma.Decimal(50),
  };

  beforeEach(() => {
    (prisma.travelRequest.findUnique as jest.Mock).mockResolvedValue(fixture);
    (prisma.travelRequest.update as jest.Mock).mockImplementation(async ({ data }) => data);
    (prisma.$transaction as jest.Mock).mockImplementation(async callback => callback(prisma));
  });

  test('sums stored Decimal components rather than concatenating or trusting an old total', async () => {
    const result = await travelService.updateSettlement({ role: 'ADMIN' } as any, 'fixture', {});
    expect(result.totalExpenseClaimed?.toString()).toBe('1100');
    expect(result.amountPayable?.toString()).toBe('1050');
  });

  test('preserves explicit zero adjustments', async () => {
    const result = await travelService.updateSettlement({ role: 'ADMIN' } as any, 'fixture', {
      hotelExpense: 0, foodAllowance: 0, localConveyance: 0, otherExpenses: 0,
    });
    expect(result.totalExpenseClaimed?.toString()).toBe('0');
    expect(result.amountPayable?.toString()).toBe('-50');
  });

  test('adds fractional overrides exactly to unchanged Decimal components', async () => {
    const result = await travelService.updateSettlement({ role: 'ADMIN' } as any, 'fixture', {
      hotelExpense: 0.1, foodAllowance: 0.2,
    });
    expect(result.totalExpenseClaimed?.toString()).toBe('500.3');
    expect(result.amountPayable?.toString()).toBe('450.3');
  });
});

