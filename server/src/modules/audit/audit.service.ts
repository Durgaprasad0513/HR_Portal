import prisma from '../../config/database';

export class AuditService {
  async getAllLogs(filters: any) {
    return prisma.auditLog.findMany({
      where: filters,
      include: {
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getModuleLogs(moduleAffected: string) {
    return prisma.auditLog.findMany({
      where: { moduleAffected },
      include: {
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createAuditLog(data: {
    actionPerformed: string;
    moduleAffected: string;
    recordIdAffected: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userId: string;
  }) {
    return prisma.auditLog.create({
      data: {
        ...data,
        oldValue: data.oldValue ? JSON.stringify(data.oldValue) : undefined,
        newValue: data.newValue ? JSON.stringify(data.newValue) : undefined
      }
    });
  }
}

export const auditService = new AuditService();
