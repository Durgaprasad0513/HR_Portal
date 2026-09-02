import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';
import { userController } from './user.controller';

const router = Router();

router.use(authenticate);
router.use(authorize(Role.ADMIN)); // Only ADMIN can manage users

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id/role', userController.changeRole);
router.patch('/:id/status', userController.toggleStatus);
router.post('/:id/reset-password', userController.resetPassword);

export default router;
