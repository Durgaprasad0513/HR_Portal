import { Router } from 'express';
import { assetController } from './asset.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createAssetSchema, updateAssetSchema, assignAssetSchema, returnAssetSchema } from './asset.schema';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/my-assets', assetController.getMyAssets);

router.post('/', authorize(Role.ADMIN, Role.HR), validate(createAssetSchema), assetController.createAsset);
router.get('/', authorize(Role.ADMIN, Role.HR), assetController.getAssets);
router.get('/:id', authorize(Role.ADMIN, Role.HR), assetController.getAssetById);
router.patch('/:id', authorize(Role.ADMIN, Role.HR), validate(updateAssetSchema), assetController.updateAsset);
router.patch('/:id/assign', authorize(Role.ADMIN, Role.HR), validate(assignAssetSchema), assetController.assignAsset);
router.patch('/:id/return', authorize(Role.ADMIN, Role.HR), validate(returnAssetSchema), assetController.returnAsset);

export default router;
