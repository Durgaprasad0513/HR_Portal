import { Router } from 'express';
import { loginHistoryController } from './loginHistory.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(requirePermission('loginHistory', 'view'));

router.get('/', loginHistoryController.getAllHistory);

export default router;
