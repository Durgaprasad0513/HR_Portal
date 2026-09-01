import { Router } from 'express';
import { settingsController } from './settings.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Only ADMIN and HR should have access based on the permission catalog
router.get('/', requirePermission('settings', 'view'), settingsController.getSettings);
router.put('/', requirePermission('settings', 'edit'), settingsController.updateSettings);

export default router;
