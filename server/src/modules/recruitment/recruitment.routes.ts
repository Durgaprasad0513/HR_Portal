import { Router } from 'express';
import { recruitmentController } from './recruitment.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createRequisitionSchema, updateRequisitionSchema, createCandidateSchema, updateCandidateSchema } from './recruitment.schema';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.ADMIN, Role.HR));

router.post('/requisitions', validate(createRequisitionSchema), recruitmentController.createRequisition);
router.get('/requisitions', recruitmentController.getRequisitions);
router.patch('/requisitions/:id', validate(updateRequisitionSchema), recruitmentController.updateRequisition);

router.post('/candidates', validate(createCandidateSchema), recruitmentController.createCandidate);
router.get('/requisitions/:requisitionId/candidates', recruitmentController.getCandidatesByRequisition);
router.patch('/candidates/:id', validate(updateCandidateSchema), recruitmentController.updateCandidate);

export default router;
