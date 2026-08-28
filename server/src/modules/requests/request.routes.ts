import { Router } from 'express';
import { requestController } from './request.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createRequestSchema, assignRequestSchema, updateRequestStatusSchema } from './request.schema';

const router = Router();

router.use(authenticate);

router.post('/', validate(createRequestSchema), requestController.createRequest);
router.get('/my-requests', requestController.getMyRequests);

router.get('/', authorize('ADMIN', 'HR'), requestController.getAllRequests);
router.put('/:id/assign', authorize('ADMIN', 'HR'), validate(assignRequestSchema), requestController.assignRequest);
router.put('/:id/status', authorize('ADMIN', 'HR'), validate(updateRequestStatusSchema), requestController.updateRequestStatus);

export default router;
