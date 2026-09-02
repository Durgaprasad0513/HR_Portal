import { Router } from 'express';
import { requestController } from './request.controller';
import { authenticate, requirePermission, requireStaffView } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createRequestSchema, assignRequestSchema, updateRequestStatusSchema } from './request.schema';

const router = Router();

router.use(authenticate);

router.post('/', requirePermission('requests', 'add'), validate(createRequestSchema), requestController.createRequest);
router.get('/staff', requireStaffView('requests'), requestController.getStaffUsers);
router.get('/my-requests', requirePermission('requests', 'view'), requestController.getMyRequests);
router.get('/', requireStaffView('requests'), requestController.getAllRequests);
router.put('/:id/assign', requirePermission('requests', 'edit'), validate(assignRequestSchema), requestController.assignRequest);
router.put('/:id/status', requirePermission('requests', 'approve'), validate(updateRequestStatusSchema), requestController.updateRequestStatus);

export default router;
