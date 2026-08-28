import { Router } from 'express';
import { policyController } from './policy.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createPolicySchema, updatePolicySchema, acknowledgePolicySchema } from './policy.schema';

const router = Router();

router.use(authenticate);

router.get('/', policyController.getAllPolicies);
router.get('/my-acknowledgements', policyController.getMyAcknowledgements);
router.post('/:id/acknowledge', validate(acknowledgePolicySchema), policyController.acknowledgePolicy);

router.post('/', authorize('ADMIN', 'HR'), validate(createPolicySchema), policyController.createPolicy);
router.put('/:id', authorize('ADMIN', 'HR'), validate(updatePolicySchema), policyController.updatePolicy);
router.delete('/:id', authorize('ADMIN', 'HR'), policyController.deletePolicy);
router.get('/:id/acknowledgements', authorize('ADMIN', 'HR'), policyController.getAcknowledgementStatus);

export default router;
