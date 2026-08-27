import prisma from '../../config/database';
import { AssetStatus } from '@prisma/client';

export class AssetService {
  async createAsset(data: any) {
    return prisma.asset.create({ data });
  }

  async updateAsset(id: string, data: any) {
    return prisma.asset.update({ where: { id }, data });
  }

  async getAssets(filters: any = {}) {
    return prisma.asset.findMany({
      where: filters,
      include: {
        assignedEmployee: {
          select: { id: true, firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAssetById(id: string) {
    return prisma.asset.findUnique({
      where: { id },
      include: {
        assignedEmployee: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });
  }

  async assignAsset(id: string, data: any) {
    return prisma.asset.update({
      where: { id },
      data: {
        ...data,
        status: AssetStatus.IN_USE
      }
    });
  }

  async returnAsset(id: string, data: any) {
    return prisma.asset.update({
      where: { id },
      data: {
        ...data,
        assignedEmployeeId: null,
        status: AssetStatus.IN_USE
      }
    });
  }
}

export const assetService = new AssetService();
