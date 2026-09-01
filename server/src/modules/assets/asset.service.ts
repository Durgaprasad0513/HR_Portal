import prisma from '../../config/database';
import { notificationDispatcher } from '../../utils/notification.dispatcher';
import { AssetStatus, Role, Prisma } from '@prisma/client';
import { getModuleScope } from '../../utils/authorization';

interface CurrentUser {
  userId: string;
  role: Role | string;
  employeeId?: string | null;
}

export class AssetService {
  async createAsset(data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const asset = await prisma.asset.create({ data });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_ASSET',
        moduleAffected: 'assets',
        recordIdAffected: asset.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return asset;
  }

  async updateAsset(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const asset = await prisma.asset.update({ where: { id }, data });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPDATE_ASSET',
        moduleAffected: 'assets',
        recordIdAffected: asset.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return asset;
  }

  async getAssets(currentUser: CurrentUser, filters: any = {}) {
    const scope = getModuleScope(currentUser.role as Role, 'assets');
    if (scope !== 'ORG' && !currentUser.employeeId) return [];

    let scopeQuery: Prisma.AssetWhereInput = {};
    if (scope === 'SELF') {
      scopeQuery = { assignedEmployeeId: currentUser.employeeId };
    } else if (scope === 'TEAM') {
      scopeQuery = {
        assignedEmployee: { OR: [{ id: currentUser.employeeId! }, { managerId: currentUser.employeeId! }] }
      };
    }

    return prisma.asset.findMany({
      where: { ...filters, ...scopeQuery },
      include: { assignedEmployee: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAssetById(currentUser: CurrentUser, id: string) {
    const scope = getModuleScope(currentUser.role as Role, 'assets');
    
    let scopeQuery: Prisma.AssetWhereInput = {};
    if (scope === 'SELF') {
      scopeQuery = { assignedEmployeeId: currentUser.employeeId };
    } else if (scope === 'TEAM') {
      scopeQuery = {
        assignedEmployee: { OR: [{ id: currentUser.employeeId! }, { managerId: currentUser.employeeId! }] }
      };
    }

    const asset = await prisma.asset.findFirst({
      where: { id, ...scopeQuery },
      include: {
        assignedEmployee: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } }
      }
    });

    if (!asset) throw new Error('Asset not found or access denied');
    return asset;
  }

  async assignAsset(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const existing = await prisma.asset.findUnique({ where: { id } });
    if (!existing) throw new Error('Asset not found.');
    if (existing.status === AssetStatus.LOST || existing.status === AssetStatus.RETIRED) {
      throw new Error(`Cannot assign an asset that is currently ${existing.status}.`);
    }
    if (existing.assignedEmployeeId) {
      throw new Error('Asset is already assigned to an employee.');
    }

    const asset = await prisma.$transaction(async (tx) => {
      return tx.asset.update({
        where: { id },
        data: {
          assignedEmployeeId: data.assignedEmployeeId,
          issueDate: data.issueDate ?? new Date(),
          issueCondition: data.issueCondition,
          status: AssetStatus.IN_USE
        }
      });
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'ASSIGN_ASSET',
        moduleAffected: 'assets',
        recordIdAffected: asset.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return asset;
  }

  async returnAsset(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const existing = await prisma.asset.findUnique({ where: { id } });
    if (!existing) throw new Error('Asset not found.');
    if (!existing.assignedEmployeeId) throw new Error('Asset is not currently assigned.');

    const asset = await prisma.$transaction(async (tx) => {
      return tx.asset.update({
        where: { id },
        data: {
          assignedEmployeeId: null,
          returnDate: data.returnDate ?? new Date(),
          returnCondition: data.returnCondition,
          status: AssetStatus.RETURNED
        }
      });
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'RETURN_ASSET',
        moduleAffected: 'assets',
        recordIdAffected: asset.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return asset;
  }

  async reportAssetDamage(id: string, userId: string, reqContext: { ipAddress?: string } = {}) {
    const asset = await prisma.asset.update({
      where: { id },
      data: { status: AssetStatus.DAMAGED }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'REPORT_ASSET_DAMAGED',
        moduleAffected: 'assets',
        recordIdAffected: asset.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return asset;
  }

  async reportAssetLost(id: string, userId: string, reqContext: { ipAddress?: string } = {}) {
    const asset = await prisma.asset.update({
      where: { id },
      data: { status: AssetStatus.LOST }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'REPORT_ASSET_LOST',
        moduleAffected: 'assets',
        recordIdAffected: asset.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return asset;
  }
}

export const assetService = new AssetService();
