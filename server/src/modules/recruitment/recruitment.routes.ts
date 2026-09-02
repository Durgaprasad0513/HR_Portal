import { Router } from 'express';
import { recruitmentController } from './recruitment.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { 
  createRequisitionSchema, 
  updateRequisitionStatusSchema, 
  createCandidateSchema, 
  screenCandidateSchema,
  interviewCandidateSchema,
  offerCandidateSchema
} from './recruitment.schema';

const router = Router();

router.use(authenticate);

// Requisitions
router.post('/requisitions', requirePermission('recruitment', 'add'), validateRequest({ body: createRequisitionSchema }), (req, res) => recruitmentController.createRequisition(req, res));
router.get('/requisitions', requirePermission('recruitment', 'view'), (req, res) => recruitmentController.getRequisitions(req, res));
router.put('/requisitions/:id/status', requirePermission('recruitment', 'edit'), validateRequest({ body: updateRequisitionStatusSchema }), (req, res) => recruitmentController.updateRequisitionStatus(req, res));

// Candidates
router.post('/candidates', requirePermission('recruitment', 'add'), validateRequest({ body: createCandidateSchema }), (req, res) => recruitmentController.createCandidate(req, res));
router.get('/requisitions/:reqId/candidates', requirePermission('recruitment', 'view'), (req, res) => recruitmentController.getCandidatesByRequisition(req, res));
router.put('/candidates/:id/screen', requirePermission('recruitment', 'edit'), validateRequest({ body: screenCandidateSchema }), (req, res) => recruitmentController.screenCandidate(req, res));
router.put('/candidates/:id/interview', requirePermission('recruitment', 'edit'), validateRequest({ body: interviewCandidateSchema }), (req, res) => recruitmentController.interviewCandidate(req, res));
router.put('/candidates/:id/offer', requirePermission('recruitment', 'edit'), validateRequest({ body: offerCandidateSchema }), (req, res) => recruitmentController.offerCandidate(req, res));

export default router;
