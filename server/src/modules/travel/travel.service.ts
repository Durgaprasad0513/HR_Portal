import prisma from '../../config/database';
import { ApprovalStatus, SettlementStatus } from '@prisma/client';

export class TravelService {
  async createTravelRequest(employeeId: string, data: any) {
    return prisma.travelRequest.create({
      data: {
        ...data,
        employeeId
      }
    });
  }

  async getTravelRequests(filters: any) {
    return prisma.travelRequest.findMany({
      where: filters,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, department: true, designation: true }
        },
        approver: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTravelRequestById(id: string) {
    return prisma.travelRequest.findUnique({
      where: { id },
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, department: true, designation: true }
        },
        approver: {
          select: { firstName: true, lastName: true }
        },
        verifiedBy: { select: { email: true } }
      }
    });
  }

  async updateApprovalStatus(id: string, data: any, approverId: string) {
    return prisma.travelRequest.update({
      where: { id },
      data: {
        ...data,
        approverId,
        approvalDate: new Date()
      }
    });
  }

  async updateSettlement(id: string, data: any, verifiedById: string) {
    return prisma.travelRequest.update({
      where: { id },
      data: {
        ...data,
        verifiedById,
        settlementDate: data.settlementStatus === SettlementStatus.SETTLED ? new Date() : undefined
      }
    });
  }
}

export const travelService = new TravelService();
