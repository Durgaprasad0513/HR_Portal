import { Router } from 'express';
import { performanceController } from './performance.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createPerformanceReviewSchema, updateReviewRatingsSchema, approveReviewSchema } from './performance.schema';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Employee route
router.get('/my-reviews', performanceController.getMyReviews);
router.patch('/:id/ratings', validate(updateReviewRatingsSchema), performanceController.updateReviewRatings);

// Admin, HR, Manager routes
router.post('/', authorize(Role.ADMIN, Role.HR, Role.MANAGER), validate(createPerformanceReviewSchema), performanceController.createReview);
router.get('/', authorize(Role.ADMIN, Role.HR, Role.MANAGER), performanceController.getReviews);

// Admin, HR routes
router.patch('/:id/approve', authorize(Role.ADMIN, Role.HR), validate(approveReviewSchema), performanceController.approveReview);

export default router;
