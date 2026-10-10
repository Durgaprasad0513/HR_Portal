import prisma from '../../config/database';
import { notificationService } from '../notifications/notification.service';
import { Role, Prisma, RequisitionStatus } from '@prisma/client';
import { getModuleScope } from '../../utils/authorization';

interface CurrentUser {
  id: string;
  userId: string;
  email: string;
  role: string;
  employeeId?: string | null;
}

export class RecruitmentService {
  private async closeFilledRequisition(tx: Prisma.TransactionClient, requisitionId: string, userId: string, ipAddress?: string) {
    const requisition = await tx.requisition.findUniqueOrThrow({ where: { id: requisitionId } });
    const selectedCount = await tx.candidate.count({ where: {
      requisitionId,
      selectionStatus: 'SELECTED',
      OR: [{ offerStatus: null }, { offerStatus: { not: 'OFFER_DECLINED' } }],
    } });
    if (selectedCount > requisition.numberOfVacancies) throw new Error('All vacancies are already filled. Increase the vacancy count before selecting another candidate.');
    if (selectedCount < requisition.numberOfVacancies) {
      if (requisition.status === 'CLOSED') {
        const lastClosure = await tx.auditLog.findFirst({
          where: { moduleAffected: 'recruitment', recordIdAffected: requisitionId,
            actionPerformed: { in: ['CLOSE_FILLED_REQUISITION', 'UPDATE_REQUISITION_STATUS'] } },
          orderBy: { createdAt: 'desc' },
        });
        if (lastClosure?.actionPerformed === 'CLOSE_FILLED_REQUISITION') {
          let previousStatus: string | undefined;
          try { previousStatus = JSON.parse(lastClosure.oldValue || '{}').status; } catch { /* Legacy audit data falls back to REQUIREMENT. */ }
          const restoredStatus = previousStatus && Object.values(RequisitionStatus).includes(previousStatus as RequisitionStatus)
            && !['CLOSED', 'JOINED_REJECTED'].includes(previousStatus) ? previousStatus as RequisitionStatus : 'REQUIREMENT';
          await tx.requisition.update({ where: { id: requisitionId }, data: { status: restoredStatus, stageUpdatedAt: new Date() } });
          await tx.auditLog.create({ data: { actionPerformed: 'REOPEN_UNFILLED_REQUISITION', moduleAffected: 'recruitment',
            recordIdAffected: requisitionId, userId, ipAddress } });
        }
      }
      return;
    }
    const { count: closedCount } = await tx.requisition.updateMany({
      where: { id: requisitionId, status: { notIn: ['CLOSED', 'JOINED_REJECTED'] } },
      data: { status: 'CLOSED', stageUpdatedAt: new Date() },
    });
    if (!closedCount) return;

    await tx.auditLog.create({
      data: {
        actionPerformed: 'CLOSE_FILLED_REQUISITION',
        oldValue: JSON.stringify({ status: requisition.status }),
        moduleAffected: 'recruitment',
        recordIdAffected: requisitionId,
        userId,
        ipAddress,
      }
    });
  }

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

  async updateRequisition(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const req = await prisma.requisition.findUnique({ where: { id } });
    if (!req) throw new Error('Requisition not found.');

    if (data.departmentId) {
      const department = await prisma.department.findUnique({ where: { id: data.departmentId }, select: { id: true } });
      if (!department) throw new Error('Department not found.');
    }

    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM requisitions WHERE id = ${id} FOR UPDATE`;
      const updated = await tx.requisition.update({
        where: { id },
        data: {
          positionTitle: data.positionTitle,
          departmentId: data.departmentId,
          location: data.location,
          numberOfVacancies: data.numberOfVacancies
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'UPDATE_REQUISITION',
          moduleAffected: 'recruitment',
          recordIdAffected: id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      if (data.numberOfVacancies !== undefined) {
        await this.closeFilledRequisition(tx, id, userId, reqContext.ipAddress);
        return tx.requisition.findUniqueOrThrow({ where: { id } });
      }
      return updated;
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

    const requisitions = await prisma.requisition.findMany({
      where: { ...filters, ...scopeQuery },
      include: {
        department: true,
        raisedBy: { select: { id: true, firstName: true, lastName: true } },
        candidates: { select: {
          selectionStatus: true,
          interviewRound: true,
          offerStatus: true,
          updatedAt: true
        } },
        _count: { select: { candidates: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return requisitions.map(({ candidates, ...requisition }) => ({
      ...requisition,
      candidates,
      selectedCount: candidates.filter(candidate => candidate.selectionStatus !== 'SELECTION_REJECTED'
        && candidate.offerStatus !== 'OFFER_DECLINED' && (
        candidate.selectionStatus === 'SELECTED'
        || candidate.offerStatus === 'RELEASED'
        || candidate.offerStatus === 'OFFER_ACCEPTED'
      )).length,
      offerCount: candidates.filter(candidate =>
        candidate.interviewRound?.trim().toUpperCase().replace(/[\s-]+/g, '_') === 'OFFER'
        || candidate.offerStatus === 'RELEASED'
        || candidate.offerStatus === 'OFFER_ACCEPTED'
      ).length
    }));
  }

  async updateRequisitionStatus(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const req = await prisma.requisition.findUnique({ where: { id } });
    if (!req) throw new Error('Requisition not found.');

    return prisma.$transaction(async (tx) => {
      const updated = await tx.requisition.update({
        where: { id },
        data: { status: data.status, stageUpdatedAt: new Date() }
      });
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
      await tx.$queryRaw`SELECT "id" FROM "requisitions" WHERE "id" = ${data.requisitionId} FOR UPDATE`;
      const requisition = await tx.requisition.findUnique({ where: { id: data.requisitionId } });
      if (!requisition) throw new Error('Requisition not found.');
      if (['CLOSED', 'JOINED_REJECTED'].includes(requisition.status)) throw new Error('This requisition is closed. Reopen it before scheduling a candidate.');
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

  async getAllInterviews(currentUser: CurrentUser) {
    const scope = getModuleScope(currentUser.role as Role, 'recruitment');
    
    const whereClause: any = {
      OR: [
        { interviewDate: { not: null } },
        { interviewRound: 'OFFER' },
        { offerStatus: { in: ['RELEASED', 'OFFER_ACCEPTED', 'OFFER_DECLINED'] } },
      ]
    };

    if (scope === 'SELF') {
      whereClause.requisition = { raisedById: currentUser.employeeId };
    } else if (scope === 'TEAM') {
      const emp = await prisma.employee.findUnique({ where: { id: currentUser.employeeId! }, select: { departmentId: true } });
      whereClause.requisition = { departmentId: emp?.departmentId };
    }

    return prisma.candidate.findMany({
      where: whereClause,
      include: {
        requisition: { select: { positionTitle: true } },
        interviewer: { select: { firstName: true, lastName: true } }
      },
      orderBy: { interviewDate: 'asc' }
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
        interviewer: { select: { id: true, firstName: true, lastName: true } }, requisition: { select: { id: true, positionTitle: true } }
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

    const updated = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "requisitions" WHERE "id" = ${candidate.requisitionId} FOR UPDATE`;
      const current = await tx.candidate.findUniqueOrThrow({ where: { id } });
      const updated = await tx.candidate.update({
        where: { id },
        data: {
          screeningStatus: current.screeningStatus === 'SCREENING_PENDING' ? 'SHORTLISTED' : current.screeningStatus,
          interviewRound: data.interviewRound ?? current.interviewRound,
          interviewDate: data.interviewDate ? new Date(data.interviewDate) : current.interviewDate,
          interviewLocation: data.interviewLocation ?? current.interviewLocation,
          interviewFeedback: data.interviewFeedback ?? current.interviewFeedback,
          interviewScore: data.interviewScore ?? current.interviewScore,
          selectionStatus: Object.prototype.hasOwnProperty.call(data, 'selectionStatus')
            ? data.selectionStatus
            : current.selectionStatus,
          interviewerId: data.interviewerId ?? current.interviewerId
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
      await this.closeFilledRequisition(tx, candidate.requisitionId, userId, reqContext.ipAddress);
      return updated;
    });
    return updated;
  }

  async offerCandidate(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) throw new Error('Candidate not found.');

    const updated = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "requisitions" WHERE "id" = ${candidate.requisitionId} FOR UPDATE`;
      const current = await tx.candidate.findUniqueOrThrow({ where: { id } });
      const updated = await tx.candidate.update({
        where: { id },
        data: {
          screeningStatus: 'SHORTLISTED',
          selectionStatus: 'SELECTED', // Auto-select if moving straight to offer
          interviewRound: data.offerStatus === 'NOT_RELEASED' ? current.interviewRound : 'OFFER',
          offerStatus: data.offerStatus,
          offerDate: data.offerDate ? new Date(data.offerDate) : current.offerDate,
          offeredSalary: data.offeredSalary ?? current.offeredSalary,
          joiningDate: data.joiningDate ? new Date(data.joiningDate) : current.joiningDate,
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
      await this.closeFilledRequisition(tx, candidate.requisitionId, userId, reqContext.ipAddress);
      return updated;
    });
    return updated;
  }
}

export const recruitmentService = new RecruitmentService();



