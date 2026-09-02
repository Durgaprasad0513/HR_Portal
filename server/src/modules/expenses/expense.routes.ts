import { Router } from 'express';
import { expenseController } from './expense.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRequest } from '../../middleware/validate.middleware';
import { createExpenseSchema, updateExpenseStatusSchema } from './expense.schema';

const router = Router();

router.use(authenticate);

// No strict requirePermission middleware since employees need to submit, 
// we will rely on service-level scope checks.
router.get('/', (req, res) => expenseController.getAll(req, res));
router.post('/', validateRequest({ body: createExpenseSchema }), (req, res) => expenseController.create(req, res));
router.patch('/:id/status', validateRequest({ body: updateExpenseStatusSchema }), (req, res) => expenseController.updateStatus(req, res));

export default router;
