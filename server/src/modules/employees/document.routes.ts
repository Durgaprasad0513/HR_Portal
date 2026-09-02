import { Router } from 'express';
import { documentController } from './document.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { uploadDocumentSchema } from './document.schema';
import multer from 'multer';

// Dummy retention state: storing in memory / local temp folder for this gate
const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/upload', authenticate, upload.single('file'), validate(uploadDocumentSchema), (req, res) => documentController.upload(req, res));
router.get('/:employeeId', authenticate, (req, res) => documentController.getEmployeeDocuments(req, res));
router.get('/:id/download-link', authenticate, (req, res) => documentController.generateDownloadLink(req, res));
router.delete('/:id', authenticate, (req, res) => documentController.deleteDocument(req, res));
router.put('/:id/verify', authenticate, (req, res) => documentController.verifyDocument(req, res));

export default router;
