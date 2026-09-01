import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { loginSchema, changePasswordSchema, setupPasswordSchema } from './auth.schema';

const router = Router();

router.post('/login', validate(loginSchema), (req, res) => authController.login(req, res));
router.get('/me', authenticate, (req, res) => authController.getMe(req, res));


router.post('/change-password', authenticate, validate(changePasswordSchema), (req, res) => authController.changePassword(req, res));
router.post('/setup-password', validate(setupPasswordSchema), (req, res) => authController.setupPassword(req, res));

export default router;
