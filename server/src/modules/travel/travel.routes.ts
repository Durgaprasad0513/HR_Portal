import { Router } from 'express';
import { travelController } from './travel.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createTravelRequestSchema, updateApprovalStatusSchema, updateSettlementSchema } from './travel.schema';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Employee routes
router.post('/', validate(createTravelRequestSchema), travelController.createTravelRequest);
router.get('/my-requests', travelController.getMyRequests);
router.get('/:id', travelController.getRequestById);

// Admin, HR, Manager routes
router.get('/', authorize(Role.ADMIN, Role.HR, Role.MANAGER), travelController.getAllRequests);
router.patch('/:id/approval', authorize(Role.ADMIN, Role.HR, Role.MANAGER), validate(updateApprovalStatusSchema), travelController.updateApprovalStatus);
router.patch('/:id/settlement', authorize(Role.ADMIN, Role.HR), validate(updateSettlementSchema), travelController.updateSettlement);

export default router;
