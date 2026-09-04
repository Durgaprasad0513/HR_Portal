import prisma from '../../config/database';
import { notificationService } from '../notifications/notification.service';
import { Role, Prisma } from '@prisma/client';
import { getModuleScope } from '../../utils/authorization';

interface CurrentUser {
  id: string;
  userId: string;
  email: string;
  role: string;
  employeeId?: string | null;
}

export class RecruitmentService {
  async createRequisition(data: any, raisedByEmployeeId: string, userId: string, reqContext: { ipAddress?: string } = {}) {
    const department = await prisma.department.findUnique({ where: { id: data.departmentId }, select: { id: true } });
    if (!department) throw new Error('Department not found.');

    return prisma.$transaction(async (tx) => {
      const req = await tx.requisition.create({
        data: { ...data, raisedById: raisedByEmployeeId, status: 'REQUIREMENT' }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'CREATE_REQUISITION',
          moduleAffected: 'recruitment',
          recordIdAffected: req.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return req;
    });
  }

  async getRequisitions(currentUser: CurrentUser, filters: any = {}) {
    const scope = getModuleScope(currentUser.role as Role, 'recruitment');
    if (scope !== 'ORG' && !currentUser.employeeId) return [];

    let scopeQuery: Prisma.RequisitionWhereInput = {};
    if (scope === 'SELF') {
      scopeQuery = { 
        OR: [
          { raisedById: currentUser.employeeId! },
          { status: { not: 'JOINED_REJECTED' } }
        ]
      };
    } else if (scope === 'TEAM') {
      const emp = await prisma.employee.findUnique({ where: { id: currentUser.employeeId! }, select: { departmentId: true } });
      scopeQuery = { 
        OR: [
          { departmentId: emp?.departmentId || undefined },
          { status: { not: 'JOINED_REJECTED' } }
        ]
      };
    }

    return prisma.requisition.findMany({
      where: { ...filters, ...scopeQuery },
      include: {
        department: true,
        raisedBy: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { candidates: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateRequisitionStatus(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const req = await prisma.requisition.findUnique({ where: { id } });
    if (!req) throw new Error('Requisition not found.');

    return prisma.$transaction(async (tx) => {
      const updated = await tx.requisition.update({ where: { id }, data: { status: data.status } });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'UPDATE_REQUISITION_STATUS',
          moduleAffected: 'recruitment',
          recordIdAffected: id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return updated;
    });
  }

  async createCandidate(data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    return prisma.$transaction(async (tx) => {
      const candidate = await tx.candidate.create({ data });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'CREATE_CANDIDATE',
          moduleAffected: 'recruitment',
          recordIdAffected: candidate.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return candidate;
    });
  }

  async getCandidatesByRequisition(requisitionId: string, currentUser: CurrentUser) {
    const scope = getModuleScope(currentUser.role as Role, 'recruitment');
    const req = await prisma.requisition.findUnique({ where: { id: requisitionId } });
    
    if (scope === 'SELF') {
      if (req?.raisedById !== currentUser.employeeId) throw new Error("Unauthorized to view candidates for this requisition");
    } else if (scope === 'TEAM') {
      const emp = await prisma.employee.findUnique({ where: { id: currentUser.employeeId! }, select: { departmentId: true } });
      if (req?.departmentId !== emp?.departmentId) throw new Error("Unauthorized to view candidates for this requisition");
    }
    
    return prisma.candidate.findMany({
      where: { requisitionId },
      include: {
        interviewer: { select: { id: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async screenCandidate(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) throw new Error('Candidate not found.');

    return prisma.$transaction(async (tx) => {
      const updated = await tx.candidate.update({
        where: { id },
        data: {
          screeningStatus: data.screeningStatus,
          screeningNotes: data.screeningNotes ?? candidate.screeningNotes
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'SCREEN_CANDIDATE',
          moduleAffected: 'recruitment',
          recordIdAffected: id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return updated;
    });
  }

  async interviewCandidate(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) throw new Error('Candidate not found.');
    if (candidate.screeningStatus !== 'SHORTLISTED') {
      throw new Error('Candidate must be shortlisted before interviewing.');
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.candidate.update({
        where: { id },
        data: {
          screeningStatus: candidate.screeningStatus,
          interviewRound: data.interviewRound,
          interviewDate: data.interviewDate ? new Date(data.interviewDate) : candidate.interviewDate,
          interviewFeedback: data.interviewFeedback ?? candidate.interviewFeedback,
          interviewScore: data.interviewScore ?? candidate.interviewScore,
          selectionStatus: data.selectionStatus,
          interviewerId: data.interviewerId ?? candidate.interviewerId
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'INTERVIEW_CANDIDATE',
          moduleAffected: 'recruitment',
          recordIdAffected: id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return updated;
    });
  }

  async offerCandidate(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) throw new Error('Candidate not found.');

    return prisma.$transaction(async (tx) => {
      const updated = await tx.candidate.update({
        where: { id },
        data: {
          screeningStatus: 'SHORTLISTED',
          selectionStatus: 'SELECTED', // Auto-select if moving straight to offer
          offerStatus: data.offerStatus,
          offerDate: data.offerDate ? new Date(data.offerDate) : candidate.offerDate,
          offeredSalary: data.offeredSalary ?? candidate.offeredSalary,
          joiningDate: data.joiningDate ? new Date(data.joiningDate) : candidate.joiningDate,
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'OFFER_CANDIDATE',
          moduleAffected: 'recruitment',
          recordIdAffected: id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return updated;
    });
  }
}

export const recruitmentService = new RecruitmentService();
