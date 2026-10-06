import { Router } from 'express';
import { authenticate, authorize, requirePermission } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { userController } from './user.controller';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.ADMIN, Role.HR, Role.MANAGER));

router.get('/', requirePermission('roles', 'view'), userController.getAllUsers);
router.post('/', requirePermission('roles', 'add'), userController.createUser);
router.get('/:id', requirePermission('roles', 'view'), userController.getUserById);
router.patch('/:id/role', requirePermission('roles', 'edit'), userController.changeRole);
router.patch('/:id/status', requirePermission('roles', 'edit'), userController.toggleStatus);
router.post('/:id/reset-password', requirePermission('roles', 'edit'), userController.resetPassword);

export default router;
