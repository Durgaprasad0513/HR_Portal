import prisma from '../../config/database';
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

export class TrainingService {
  async getMyTrainings(employeeId: string) {
    return prisma.trainingParticipant.findMany({
      where: { employeeId },
      include: { training: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllTrainings(currentUser: CurrentUser, filters: any = {}) {
    const scope = getModuleScope(currentUser.role as Role, 'training');
    if (scope !== 'ORG' && !currentUser.employeeId) return [];

    let scopeQuery: Prisma.TrainingWhereInput = {};
    if (scope === 'TEAM') {
      const emp = await prisma.employee.findUnique({ where: { id: currentUser.employeeId! }, select: { departmentId: true } });
      scopeQuery = { targetDepartmentId: emp?.departmentId || undefined };
    } else if (scope === 'SELF') {
      scopeQuery = { participants: { some: { employeeId: currentUser.employeeId! } } };
    }

    return prisma.training.findMany({
      where: { ...filters, ...scopeQuery },
      include: {
        _count: { select: { participants: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createTraining(data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    return prisma.$transaction(async (tx) => {
      const training = await tx.training.create({
        data: {
          ...data,
          trainingDate: new Date(data.trainingDate)
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'CREATE_TRAINING',
          moduleAffected: 'training',
          recordIdAffected: training.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return training;
    });
  }

  async updateTraining(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    return prisma.$transaction(async (tx) => {
      const updateData = { ...data };
      if (updateData.trainingDate) {
        updateData.trainingDate = new Date(updateData.trainingDate);
      }
      const training = await tx.training.update({ where: { id }, data: updateData });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'UPDATE_TRAINING',
          moduleAffected: 'training',
          recordIdAffected: id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return training;
    });
  }

  async addParticipant(trainingId: string, employeeId: string, userId: string, reqContext: { ipAddress?: string } = {}) {
    const exists = await prisma.trainingParticipant.findUnique({
      where: { trainingId_employeeId: { trainingId, employeeId } }
    });
    if (exists) throw new Error('Employee is already a participant in this training');

    return prisma.$transaction(async (tx) => {
      const participant = await tx.trainingParticipant.create({
        data: { trainingId, employeeId }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'ADD_TRAINING_PARTICIPANT',
          moduleAffected: 'training',
          recordIdAffected: participant.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      // Notify employee of training assignment
      notificationDispatcher.dispatch({
        employeeId,
        notificationType: 'TRAINING_NOTIF',
        message: `You have been assigned to a training program. Please check the training portal.`,
        triggerEvent: 'TRAINING_ASSIGNED',
        channels: ['IN_APP', 'EMAIL']
      }).catch(() => {});
      return participant;
    });
  }

  async removeParticipant(trainingId: string, employeeId: string, userId: string, reqContext: { ipAddress?: string } = {}) {
    return prisma.$transaction(async (tx) => {
      const participant = await tx.trainingParticipant.findUnique({
        where: { trainingId_employeeId: { trainingId, employeeId } }
      });
      if (!participant) throw new Error('Participant not found');

      await tx.trainingParticipant.delete({
        where: { id: participant.id }
      });
      
      await tx.auditLog.create({
        data: {
          actionPerformed: 'REMOVE_TRAINING_PARTICIPANT',
          moduleAffected: 'training',
          recordIdAffected: participant.id,
          userId,
          ipAddress: reqContext.ipAddress,
        }
      });
    });
  }

  async submitFeedback(trainingId: string, employeeId: string, data: any, currentUser: CurrentUser, reqContext: { ipAddress?: string } = {}) {
    if (currentUser.employeeId !== employeeId) {
      throw new Error('You can only submit feedback for your own participation');
    }

    const participant = await prisma.trainingParticipant.findUnique({
      where: { trainingId_employeeId: { trainingId, employeeId } }
    });
    if (!participant) throw new Error('Participant not found');

    return prisma.$transaction(async (tx) => {
      const updated = await tx.trainingParticipant.update({
        where: { id: participant.id },
        data: {
          feedbackRating: data.feedbackRating,
          feedbackComments: data.feedbackComments
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'SUBMIT_TRAINING_FEEDBACK',
          moduleAffected: 'training',
          recordIdAffected: participant.id,
          userId: currentUser.userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return updated;
    });
  }

  async recordAssessment(trainingId: string, employeeId: string, data: any, currentUser: CurrentUser, reqContext: { ipAddress?: string } = {}) {
    const scope = getModuleScope(currentUser.role as Role, 'training');
    if (scope === 'SELF') {
      throw new Error('Employees cannot record their own assessments');
    }

    const participant = await prisma.trainingParticipant.findUnique({
      where: { trainingId_employeeId: { trainingId, employeeId } }
    });
    if (!participant) throw new Error('Participant not found');

    return prisma.$transaction(async (tx) => {
      const updated = await tx.trainingParticipant.update({
        where: { id: participant.id },
        data: {
          attendanceStatus: data.attendanceStatus,
          assessmentScore: data.assessmentScore,
          certificateIssued: data.certificateIssued,
          certificateFile: data.certificateFile
        }
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: 'RECORD_TRAINING_ASSESSMENT',
          moduleAffected: 'training',
          recordIdAffected: participant.id,
          userId: currentUser.userId,
          ipAddress: reqContext.ipAddress,
        }
      });
      return updated;
    });
  }
}

export const trainingService = new TrainingService();
