import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { permissionController } from './permission.controller';
import { updatePermissionSchema } from './permission.schema';

const router = Router();

router.use(authenticate);

router.get('/my', permissionController.getMyPermissions);
router.get('/', permissionController.getMatrix);
router.patch('/', authorize(Role.ADMIN), validate(updatePermissionSchema), permissionController.updatePermission);

export default router;
