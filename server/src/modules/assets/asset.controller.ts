import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { assetService } from './asset.service';
import { sendSuccess, sendError } from '../../utils/response';

export class AssetController {
  async createAsset(req: AuthRequest, res: Response) {
    try {
      const asset = await assetService.createAsset(req.body);
      return sendSuccess(res, asset, 'Asset created successfully', 201);
    } catch (error) {
      return sendError(res, 'Error creating asset');
    }
  }

  async getAssets(req: AuthRequest, res: Response) {
    try {
      const assets = await assetService.getAssets(req.query);
      return sendSuccess(res, assets, 'Assets retrieved successfully');
    } catch (error) {
      return sendError(res, 'Error retrieving assets');
    }
  }

  async getMyAssets(req: AuthRequest, res: Response) {
    try {
      const assets = await assetService.getAssets({ assignedEmployeeId: req.user!.employeeId as string });
      return sendSuccess(res, assets, 'My assets retrieved successfully');
    } catch (error) {
      return sendError(res, 'Error retrieving assets');
    }
  }

  async getAssetById(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const asset = await assetService.getAssetById(id as string);
      if (!asset) return sendError(res, 'Asset not found', 404);
      return sendSuccess(res, asset, 'Asset retrieved successfully');
    } catch (error) {
      return sendError(res, 'Error retrieving asset');
    }
  }

  async updateAsset(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const asset = await assetService.updateAsset(id as string, req.body);
      return sendSuccess(res, asset, 'Asset updated successfully');
    } catch (error) {
      return sendError(res, 'Error updating asset');
    }
  }

  async assignAsset(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const asset = await assetService.assignAsset(id as string, req.body);
      return sendSuccess(res, asset, 'Asset assigned successfully');
    } catch (error) {
      return sendError(res, 'Error assigning asset');
    }
  }

  async returnAsset(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const asset = await assetService.returnAsset(id as string, req.body);
      return sendSuccess(res, asset, 'Asset returned successfully');
    } catch (error) {
      return sendError(res, 'Error returning asset');
    }
  }
}

export const assetController = new AssetController();
