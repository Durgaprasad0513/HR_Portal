import prisma from '../../config/database';

export class PerformanceService {
  async createReview(data: any) {
    return prisma.performanceReview.create({ data });
  }

  async getReviews(filters: any = {}) {
    return prisma.performanceReview.findMany({
      where: filters,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } },
        finalApprovedBy: { select: { id: true, firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateReview(id: string, data: any) {
    return prisma.performanceReview.update({ where: { id }, data });
  }

  async approveReview(id: string, data: any, approvedById: string) {
    return prisma.performanceReview.update({
      where: { id },
      data: {
        ...data,
        finalApprovedById: approvedById,
        finalApprovalDate: new Date()
      }
    });
  }
}

export const performanceService = new PerformanceService();
