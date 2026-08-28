import prisma from '../../config/database';

export class PolicyService {
  async getAllPolicies() {
    return prisma.policy.findMany({
      include: {
        uploadedBy: true
      }
    });
  }

  async createPolicy(uploadedById: string, data: any) {
    return prisma.policy.create({
      data: {
        ...data,
        uploadedById
      }
    });
  }

  async updatePolicy(id: string, data: any) {
    return prisma.policy.update({
      where: { id },
      data
    });
  }

  async deletePolicy(id: string) {
    return prisma.policy.delete({
      where: { id }
    });
  }

  async acknowledgePolicy(policyId: string, employeeId: string, status: string) {
    return prisma.policyAcknowledgement.upsert({
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
        employee: true
      }
    });
  }
}

export const policyService = new PolicyService();
