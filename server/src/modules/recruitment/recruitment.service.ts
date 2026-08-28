import prisma from '../../config/database';

export class RecruitmentService {
  async createRequisition(data: any, raisedById: string) {
    return prisma.requisition.create({
      data: { ...data, raisedById }
    });
  }

  async getRequisitions(filters: any = {}) {
    return prisma.requisition.findMany({
      where: filters,
      include: {
        department: true,
        raisedBy: { select: { id: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateRequisition(id: string, data: any) {
    return prisma.requisition.update({ where: { id }, data });
  }

  async createCandidate(data: any) {
    return prisma.candidate.create({ data });
  }

  async getCandidatesByRequisition(requisitionId: string) {
    return prisma.candidate.findMany({
      where: { requisitionId },
      include: {
        interviewer: { select: { id: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateCandidate(id: string, data: any) {
    return prisma.candidate.update({ where: { id }, data });
  }
}

export const recruitmentService = new RecruitmentService();
