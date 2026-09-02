import prisma from '../../config/database';
import { notificationService } from '../notifications/notification.service';
import { notificationDispatcher } from '../../utils/notification.dispatcher';
import { Role, Prisma } from '@prisma/client';
import { getModuleScope } from '../../utils/authorization';

interface CurrentUser {
  id: string;
  userId: string;
  email: string;
  role: string;
  employeeId?: string | null;
}

export class PerformanceService {
  async getMyReviews(employeeId: string) {
    return prisma.performanceReview.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getReviews(currentUser: CurrentUser, filters: any = {}) {
    const scope = getModuleScope(currentUser.role as Role, 'performance');
    if (scope !== 'ORG' && !currentUser.employeeId) return [];

    let scopeQuery: Prisma.PerformanceReviewWhereInput = {};
    if (scope === 'TEAM') {
      scopeQuery = { employee: { managerId: currentUser.employeeId! } };
    } else if (scope === 'SELF') {
      scopeQuery = { employeeId: currentUser.employeeId! };
    }

    return prisma.performanceReview.findMany({
      where: { ...filters, ...scopeQuery },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, department: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createReview(data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    return prisma.$transaction(async (tx) => {
      const review = await tx.performanceReview.create({ data });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'CREATE_PERFORMANCE_REVIEW',
          moduleAffected: 'performance',
          recordIdAffected: review.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return review;
    });
  }

  async updateReview(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    return prisma.$transaction(async (tx) => {
      const review = await tx.performanceReview.update({
        where: { id },
        data: {
          reviewPeriod: data.reviewPeriod,
          kraDescription: data.kraDescription,
          kpiWeightage: data.kpiWeightage,
          goalDescription: data.goalDescription,
          targetValue: data.targetValue
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'UPDATE_PERFORMANCE_REVIEW',
          moduleAffected: 'performance',
          recordIdAffected: review.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return review;
    });
  }

  async submitSelfAppraisal(id: string, data: any, currentUser: CurrentUser, reqContext: { ipAddress?: string } = {}) {
    const isOverride = currentUser.role === 'ADMIN' || currentUser.role === 'HR';
    
    const review = await prisma.performanceReview.findUnique({ where: { id } });
    if (!review) throw new Error('Review not found');
    
    if (!isOverride) {
      if (!currentUser.employeeId || review.employeeId !== currentUser.employeeId) {
        throw new Error('You can only submit self appraisal for your own review');
      }
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.performanceReview.update({
        where: { id },
        data: {
          status: 'MANAGER_REVIEW',
          achievedValue: data.achievedValue,
          selfRating: data.selfRating,
          employeeComments: data.employeeComments,
          strengths: data.strengths,
          areasOfImprovement: data.areasOfImprovement,
          trainingRequirement: data.trainingRequirement
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'SUBMIT_SELF_APPRAISAL',
          moduleAffected: 'performance',
          recordIdAffected: id,
          userId: currentUser.userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return updated;
    });
  }

  async submitManagerAppraisal(id: string, data: any, currentUser: CurrentUser, reqContext: { ipAddress?: string } = {}) {
    const isOverride = currentUser.role === 'ADMIN' || currentUser.role === 'HR';
    
    const review = await prisma.performanceReview.findUnique({ 
      where: { id },
      include: { employee: true } 
    });
    if (!review) throw new Error('Review not found');
    
    if (!isOverride) {
      if (!currentUser.employeeId || review.employee.managerId !== currentUser.employeeId) {
        throw new Error('Only the direct manager can submit manager appraisal');
      }
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.performanceReview.update({
        where: { id },
        data: {
          status: 'HR_REVIEW',
          managerRating: data.managerRating,
          managerComments: data.managerComments,
          promotionRecommendation: data.promotionRecommendation,
          salaryRevisionRecommendation: data.salaryRevisionRecommendation
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'SUBMIT_MANAGER_APPRAISAL',
          moduleAffected: 'performance',
          recordIdAffected: id,
          userId: currentUser.userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return updated;
    });
  }

  async submitHRAppraisal(id: string, data: any, currentUser: CurrentUser, reqContext: { ipAddress?: string } = {}) {
    if (currentUser.role !== 'HR' && currentUser.role !== 'ADMIN') {
      throw new Error('Only HR or Admin can submit HR appraisal');
    }

    const review = await prisma.performanceReview.findUnique({ where: { id } });
    if (!review) throw new Error('Review not found');

    return prisma.$transaction(async (tx) => {
      const updated = await tx.performanceReview.update({
        where: { id },
        data: {
          status: 'FINAL_APPROVAL',
          hrRating: data.hrRating,
          hrComments: data.hrComments
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'SUBMIT_HR_APPRAISAL',
          moduleAffected: 'performance',
          recordIdAffected: id,
          userId: currentUser.userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return updated;
    });
  }

  async submitFinalApproval(id: string, data: any, currentUser: CurrentUser, reqContext: { ipAddress?: string } = {}) {
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR') {
      throw new Error('Only Admin or HR can perform final approval');
    }

    const review = await prisma.performanceReview.findUnique({ where: { id } });
    if (!review) throw new Error('Review not found');

    return prisma.$transaction(async (tx) => {
      const updated = await tx.performanceReview.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          finalRating: data.finalRating,
          finalApprovalStatus: data.finalApprovalStatus,
          finalApprovalDate: new Date(),
          finalApprovedById: currentUser.employeeId || undefined
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'SUBMIT_FINAL_APPROVAL',
          moduleAffected: 'performance',
          recordIdAffected: id,
          userId: currentUser.userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      // Notify employee of final appraisal decision
      notificationDispatcher.dispatch({
        employeeId: review.employeeId,
        notificationType: 'REVIEW_DUE',
        message: `Your performance review has been finalized with status: ${data.finalApprovalStatus}.`,
        triggerEvent: data.finalApprovalStatus,
        channels: ['IN_APP', 'EMAIL']
      }).catch(() => {});
      return updated;
    });
  }
}

export const performanceService = new PerformanceService();
