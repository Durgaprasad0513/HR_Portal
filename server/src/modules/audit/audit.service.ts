import prisma from '../../config/database';

export class AuditService {
  async getAllLogs(query: any = {}) {
    const {
      module,
      action,
      userId,
      from,
      to,
      search,
      page = 1,
      limit = 50,
    } = query;

    const where: any = {};

    if (module) where.moduleAffected = module;
    if (action) where.actionPerformed = { contains: action, mode: 'insensitive' };
    if (userId) where.userId = userId;
    if (search) {
      where.OR = [
        { actionPerformed: { contains: search, mode: 'insensitive' } },
        { moduleAffected: { contains: search, mode: 'insensitive' } },
        { recordIdAffected: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    return {
      data: logs,
      pagination: {
        total,
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getModuleLogs(moduleAffected: string) {
    return prisma.auditLog.findMany({
      where: { moduleAffected },
      include: { user: { select: { id: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getSummaryStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalToday, totalMonth, failedLogins, moduleBreakdown] = await Promise.all([
      prisma.auditLog.count({ where: { createdAt: { gte: today } } }),
      prisma.auditLog.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.auditLog.count({ where: { actionPerformed: 'FAILED_LOGIN' } }),
      prisma.auditLog.groupBy({
        by: ['moduleAffected'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ]);

    return { totalToday, totalMonth, failedLogins, moduleBreakdown };
  }

  async createAuditLog(data: {
    actionPerformed: string;
    moduleAffected: string;
    recordIdAffected?: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    userId: string;
  }) {
    return prisma.auditLog.create({
      data: {
        ...data,
        oldValue: data.oldValue ? JSON.stringify(data.oldValue) : undefined,
        newValue: data.newValue ? JSON.stringify(data.newValue) : undefined,
      },
    });
  }
}

export const auditService = new AuditService();
