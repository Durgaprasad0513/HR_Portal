import { Router } from 'express';
import { trainingController } from './training.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createTrainingSchema, updateTrainingSchema, addParticipantSchema, updateParticipantSchema } from './training.schema';

const router = Router();

router.use(authenticate);

router.get('/my-trainings', trainingController.getMyTrainings);

router.get('/', authorize('ADMIN', 'HR'), trainingController.getAllTrainings);
router.post('/', authorize('ADMIN', 'HR'), validate(createTrainingSchema), trainingController.createTraining);
router.put('/:id', authorize('ADMIN', 'HR'), validate(updateTrainingSchema), trainingController.updateTraining);

router.post('/:id/participants', authorize('ADMIN', 'HR'), validate(addParticipantSchema), trainingController.addParticipant);
router.delete('/:id/participants/:employeeId', authorize('ADMIN', 'HR'), trainingController.removeParticipant);
router.put('/:id/participants/:employeeId', authorize('ADMIN', 'HR'), validate(updateParticipantSchema), trainingController.updateParticipant);

export default router;
