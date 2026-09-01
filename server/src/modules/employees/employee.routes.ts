import { Router } from 'express';
import { employeeController } from './employee.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createEmployeeSchema, updateEmployeeSchema } from './employee.schema';

const router = Router();

router.use(authenticate);

router.get('/dashboard-stats', requirePermission('dashboard', 'view'), (req, res) =>
  employeeController.getDashboardStats(req, res)
);
router.get('/', requirePermission('employees', 'view'), (req, res) => employeeController.getAll(req, res));
router.get('/:id', requirePermission('employees', 'view'), (req, res) => employeeController.getById(req, res));
router.post('/', requirePermission('employees', 'add'), validate(createEmployeeSchema), (req, res) =>
  employeeController.create(req, res)
);
router.put('/:id', requirePermission('employees', 'edit'), validate(updateEmployeeSchema), (req, res) =>
  employeeController.update(req, res)
);
router.delete('/:id', requirePermission('employees', 'delete'), (req, res) => employeeController.delete(req, res));

export default router;
