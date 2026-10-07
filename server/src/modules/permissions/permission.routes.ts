import { Router } from 'express';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { permissionController } from './permission.controller';
import { updatePermissionSchema } from './permission.schema';

const router = Router();

router.use(authenticate);

router.get('/my', permissionController.getMyPermissions);
router.get('/', requirePermission('roles', 'view'), permissionController.getMatrix);
router.patch('/', requirePermission('roles', 'edit'), validate(updatePermissionSchema), permissionController.updatePermission);

export default router;
