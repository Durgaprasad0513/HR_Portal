import { Router } from 'express';
import { policyController } from './policy.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createPolicySchema, updatePolicySchema, acknowledgePolicySchema } from './policy.schema';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('policies', 'view'), policyController.getAllPolicies);
router.get('/my-acknowledgements', requirePermission('policies', 'view'), policyController.getMyAcknowledgements);
router.post('/:id/acknowledge', requirePermission('policies', 'view'), validate(acknowledgePolicySchema), policyController.acknowledgePolicy);
router.post('/', requirePermission('policies', 'add'), validate(createPolicySchema), policyController.createPolicy);
router.put('/:id', requirePermission('policies', 'edit'), validate(updatePolicySchema), policyController.updatePolicy);
router.delete('/:id', requirePermission('policies', 'delete'), policyController.deletePolicy);
router.get('/:id/acknowledgements', requirePermission('policies', 'view'), policyController.getAcknowledgementStatus);

export default router;
