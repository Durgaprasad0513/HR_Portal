import { Router } from 'express';
import { auditController } from './audit.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(requirePermission('audit', 'view'));

router.get('/stats', auditController.getSummaryStats);
router.get('/', auditController.getAllLogs);
router.get('/:module', auditController.getModuleLogs);

export default router;
