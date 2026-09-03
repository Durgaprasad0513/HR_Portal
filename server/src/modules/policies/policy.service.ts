import prisma from '../../config/database';
import { notificationService } from '../notifications/notification.service';

export class PolicyService {
  async getAllPolicies() {
    return prisma.policy.findMany({
      include: {
        uploadedBy: { select: { id: true, email: true } }
      }
    });
  }

  async createPolicy(uploadedById: string, data: any, reqContext: { ipAddress?: string } = {}) {
    const policy = await prisma.policy.create({
      data: {
        ...data,
        uploadedById
      }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_POLICY',
        moduleAffected: 'policies',
        recordIdAffected: policy.id,
        userId: uploadedById,
        ipAddress: reqContext.ipAddress,
      }
    });

    await notificationService.notifyAllEmployees({
      notificationType: 'POLICY_UPLOAD',
      message: `New document published: ${policy.policyName} (${policy.versionNumber})`,
      triggerEvent: policy.id
    });

    return policy;
  }

  async updatePolicy(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const policy = await prisma.policy.update({
      where: { id },
      data
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPDATE_POLICY',
        moduleAffected: 'policies',
        recordIdAffected: policy.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return policy;
  }

  async deletePolicy(id: string, userId: string, reqContext: { ipAddress?: string } = {}) {
    const policy = await prisma.policy.delete({
      where: { id }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'DELETE_POLICY',
        moduleAffected: 'policies',
        recordIdAffected: policy.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return policy;
  }

  async acknowledgePolicy(policyId: string, employeeId: string, status: string, userId: string, reqContext: { ipAddress?: string } = {}) {
    const ack = await prisma.policyAcknowledgement.upsert({
      where: {
        policyId_employeeId: {
          policyId,
          employeeId
        }
      },
      update: {
        acknowledgementStatus: status as any,
        acknowledgementDate: status === 'ACKNOWLEDGED' ? new Date() : null
      },
      create: {
        policyId,
        employeeId,
        acknowledgementStatus: status as any,
        acknowledgementDate: status === 'ACKNOWLEDGED' ? new Date() : null
      }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'ACKNOWLEDGE_POLICY',
        moduleAffected: 'policies',
        recordIdAffected: ack.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return ack;
  }

  async getMyAcknowledgements(employeeId: string) {
    return prisma.policyAcknowledgement.findMany({
      where: { employeeId },
      include: {
        policy: true
      }
    });
  }

  async getAcknowledgementStatus(policyId: string) {
    return prisma.policyAcknowledgement.findMany({
      where: { policyId },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } }
      }
    });
  }
}

export const policyService = new PolicyService();
