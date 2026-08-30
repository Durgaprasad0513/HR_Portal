import { Router } from 'express';
import { departmentController } from './department.controller';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createDepartmentSchema, updateDepartmentSchema } from './department.schema';

const router = Router();

router.use(authenticate);

router.get('/', requirePermission('departments', 'view'), (req, res) => departmentController.getAll(req, res));
router.get('/:id', requirePermission('departments', 'view'), (req, res) => departmentController.getById(req, res));
router.post('/', requirePermission('departments', 'add'), validate(createDepartmentSchema), (req, res) => departmentController.create(req, res));
router.put('/:id', requirePermission('departments', 'edit'), validate(updateDepartmentSchema), (req, res) => departmentController.update(req, res));
router.delete('/:id', requirePermission('departments', 'delete'), (req, res) => departmentController.delete(req, res));

export default router;
