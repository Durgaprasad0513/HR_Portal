import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, requirePermission } from '../../middleware/auth.middleware';
import { MODULES, ModuleKey, PermissionAction } from '../permissions/permission.catalog';

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/', authenticate, upload.array('files', 10), (req, res, next) => {
  const module = req.body.module as ModuleKey;
  const action = req.body.action as PermissionAction;
  if (!MODULES.some((entry) => entry.key === module) || !['add', 'edit'].includes(action)) {
    return res.status(400).json({ success: false, message: 'A valid module and add/edit action are required.' });
  }
  requirePermission(module, action)(req, res, next);
}, (req, res) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const files = req.files as Express.Multer.File[];
  const urls = files.map(f => {
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(f.originalname)}`;
    fs.writeFileSync(path.join('uploads', filename), f.buffer);
    return `/api/uploads/${filename}`;
  });
  res.json({ success: true, urls });
});

export default router;
