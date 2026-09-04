import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate, authorize, requirePermission } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/stats', requirePermission('dashboard', 'view'), dashboardController.getStats);
router.get('/attrition', requirePermission('attrition', 'view'), dashboardController.getAttritionStats);
router.get('/reports/:type', requirePermission('dashboard', 'view'), authorize('ADMIN', 'HR'), dashboardController.getReport);

export default router;
