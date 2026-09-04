import { PrismaClient, ExpenseStatus } from '@prisma/client';
import { getModuleScope } from '../../utils/authorization';

const prisma = new PrismaClient();

interface CurrentUser {
  id: string;
  role: string;
  employeeId?: string | null;
}

export class ExpenseService {
  async getAll(currentUser: CurrentUser, query: any) {
    const scope = getModuleScope(currentUser.role as any, 'office_expenses');
    
    // If not ORG scope, they can only see their own submissions
    const whereClause: any = {};
    if (scope !== 'ORG') {
      if (!currentUser.employeeId) throw new Error('Not authorized');
      whereClause.submittedById = currentUser.employeeId;
    }

    return prisma.officeExpense.findMany({
      where: whereClause,
      include: {
        submittedBy: { select: { id: true, firstName: true, lastName: true } },
        approvedBy: { select: { id: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(currentUser: CurrentUser, data: any) {
    if (!currentUser.employeeId) throw new Error('Employee ID required to submit expense');

    return prisma.officeExpense.create({
      data: {
        expenseDate: new Date(data.expenseDate),
        category: data.category,
        description: data.description,
        amount: data.amount,
        billUpload: data.billUpload,
        submittedById: currentUser.employeeId,
      }
    });
  }

  async updateStatus(currentUser: CurrentUser, id: string, data: any) {
    const scope = getModuleScope(currentUser.role as any, 'office_expenses');
    if (scope !== 'ORG') throw new Error('Not authorized to approve expenses');
    if (!currentUser.employeeId) throw new Error('Employee ID required to approve expense');

    return prisma.officeExpense.update({
      where: { id },
      data: {
        status: data.status,
        approvedById: currentUser.employeeId
      }
    });
  }
}

export const expenseService = new ExpenseService();
