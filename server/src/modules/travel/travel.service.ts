import prisma from '../../config/database';
import { ApprovalStatus, SettlementStatus, Role, Prisma } from '@prisma/client';
import { getModuleScope } from '../../utils/authorization';
import { notificationDispatcher } from '../../utils/notification.dispatcher';

interface CurrentUser {
  userId: string;
  role: Role | string;
  employeeId?: string | null;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  APPROVAL_PENDING: ['APPROVAL_APPROVED', 'APPROVAL_REJECTED'],
  APPROVAL_APPROVED: [],   // only settle moves it forward
  APPROVAL_REJECTED: [],
};

export class TravelService {
  async createTravelRequest(currentUser: CurrentUser, data: any, reqContext: { ipAddress?: string } = {}) {
    if (!currentUser.employeeId) throw new Error('Only employees can create travel requests.');

    // Duplicate submission guard
    const existing = await prisma.travelRequest.findFirst({
      where: {
        employeeId: currentUser.employeeId,
        approvalStatus: { in: [ApprovalStatus.APPROVAL_PENDING, ApprovalStatus.APPROVAL_APPROVED] },
        startDate: { lte: new Date(data.endDate) },
        endDate: { gte: new Date(data.startDate) },
      }
    });
    if (existing) {
      throw new Error('A travel request for overlapping dates is already pending or approved. Please cancel the existing request first.');
    }

    const req = await prisma.travelRequest.create({
      data: {
        ...data,
        employeeId: currentUser.employeeId,
        approvalStatus: ApprovalStatus.APPROVAL_PENDING,
        settlementStatus: SettlementStatus.UNSETTLED,
      }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_TRAVEL_REQUEST',
        moduleAffected: 'travel',
        recordIdAffected: req.id,
        userId: currentUser.userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return req;
  }

  async getTravelRequests(currentUser: CurrentUser, filters: any = {}) {
    const scope = getModuleScope(currentUser.role as Role, 'travel');
    if (scope !== 'ORG' && !currentUser.employeeId) return [];

    let scopeQuery: Prisma.TravelRequestWhereInput = {};
    if (scope === 'SELF') {
      scopeQuery = { employeeId: currentUser.employeeId! };
    } else if (scope === 'TEAM') {
      scopeQuery = {
        employee: { OR: [{ id: currentUser.employeeId! }, { managerId: currentUser.employeeId! }] }
      };
    }

    return prisma.travelRequest.findMany({
      where: { AND: [filters, scopeQuery] },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, department: true, designation: true } },
        approver: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTravelRequestById(currentUser: CurrentUser, id: string) {
    const scope = getModuleScope(currentUser.role as Role, 'travel');
    let scopeQuery: Prisma.TravelRequestWhereInput = {};
    if (scope === 'SELF') {
      scopeQuery = { employeeId: currentUser.employeeId! };
    } else if (scope === 'TEAM') {
      scopeQuery = {
        employee: { OR: [{ id: currentUser.employeeId! }, { managerId: currentUser.employeeId! }] }
      };
    }

    const req = await prisma.travelRequest.findFirst({
      where: { AND: [{ id }, scopeQuery] },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, department: true, designation: true } },
        approver: { select: { firstName: true, lastName: true } },
        verifiedBy: { select: { email: true } }
      }
    });

    if (!req) throw new Error('Travel request not found or access denied.');
    return req;
  }

  async updateApprovalStatus(id: string, data: any, approverEmployeeId: string, approverUserId: string, reqContext: { ipAddress?: string } = {}) {
    const existing = await prisma.travelRequest.findUnique({ where: { id } });
    if (!existing) throw new Error('Travel request not found.');

    const allowed = VALID_TRANSITIONS[existing.approvalStatus] || [];
    if (!allowed.includes(data.approvalStatus)) {
      throw new Error(`Invalid transition from ${existing.approvalStatus} to ${data.approvalStatus}.`);
    }

    // Use transaction to atomically update status and advance amount
    const req = await prisma.$transaction(async (tx) => {
      return tx.travelRequest.update({
        where: { id },
        data: {
          approvalStatus: data.approvalStatus,
          approvalDate: new Date(),
          approverId: approverEmployeeId,
          advanceApproved: data.advanceApproved ?? existing.advanceApproved,
          
        }
      });
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: data.approvalStatus === 'APPROVAL_APPROVED' ? 'APPROVE_TRAVEL_REQUEST' : 'REJECT_TRAVEL_REQUEST',
        moduleAffected: 'travel',
        recordIdAffected: req.id,
        userId: approverUserId,
        ipAddress: reqContext.ipAddress,
      }
    });

    // Notify the requesting employee
    const verb = data.approvalStatus === 'APPROVAL_APPROVED' ? 'approved' : 'rejected';
    notificationDispatcher.dispatch({
      employeeId: existing.employeeId,
      notificationType: 'TRAVEL_NOTIF',
      message: `Your travel request to ${existing.destination} has been ${verb}.`,
      triggerEvent: data.approvalStatus,
      channels: ['IN_APP', 'EMAIL']
    }).catch(() => {});

    return req;
  }

  async updateSettlement(id: string, data: any, verifiedById: string, reqContext: { ipAddress?: string } = {}) {
    const existing = await prisma.travelRequest.findUnique({ where: { id } });
    if (!existing) throw new Error('Travel request not found.');
    if (existing.approvalStatus !== ApprovalStatus.APPROVAL_APPROVED) {
      throw new Error('Only approved travel requests can be settled.');
    }

    // Auto-compute financial total
    const hotel = Number(data.hotelExpense ?? existing.hotelExpense ?? 0);
    const food = Number(data.foodAllowance ?? existing.foodAllowance ?? 0);
    const conveyance = Number(data.localConveyance ?? existing.localConveyance ?? 0);
    const other = Number(data.otherExpenses ?? existing.otherExpenses ?? 0);
    const totalExpenseClaimed = hotel + food + conveyance + other;

    const req = await prisma.$transaction(async (tx) => {
      return tx.travelRequest.update({
        where: { id },
        data: {
          hotelExpense: hotel,
          foodAllowance: food,
          localConveyance: conveyance,
          otherExpenses: other,
          totalExpenseClaimed,
          settlementStatus: SettlementStatus.SETTLED,
          settlementDate: new Date(),
          verifiedById,
        }
      });
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'SETTLE_TRAVEL_REQUEST',
        moduleAffected: 'travel',
        recordIdAffected: req.id,
        userId: verifiedById,
        ipAddress: reqContext.ipAddress,
      }
    });

    return req;
  }
}

export const travelService = new TravelService();
