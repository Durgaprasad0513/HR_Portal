import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadsDirectory } from '../../config/storage';
import { authenticate, requirePermission, AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../config/database';
import { MODULES, ModuleKey, PermissionAction } from '../permissions/permission.catalog';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 10 } });
const router = Router();

router.get('/files/:module/:filename', authenticate, (req, res, next) => {
  const module = req.params.module;
  if (typeof module !== 'string' || !['travel', 'expenses', 'policies'].includes(module)) {
    res.status(404).json({ success: false, message: 'Attachment not found.' }); return;
  }
  requirePermission(module as ModuleKey, 'view')(req, res, next);
}, async (req: AuthRequest, res, next) => {
  try {
    const filename = req.params.filename as string;
    if (!/^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9]+)?$/.test(filename)) {
      res.status(400).json({ success: false, message: 'Invalid attachment name.' }); return;
    }
    const url = `/api/uploads/${filename}`;
    const staff = ['ADMIN', 'HR', 'MANAGER'].includes(req.user!.role);
    let referenced = false;
    if (req.params.module === 'travel') {
      const records = await prisma.travelRequest.findMany({
        where: { billUpload: { contains: url }, ...(!staff ? { employeeId: req.user!.employeeId ?? '__none__' } : {}) },
        select: { billUpload: true },
      });
      referenced = records.some(r => r.billUpload?.split(',').map(v => v.trim()).includes(url));
    } else if (req.params.module === 'expenses') {
      const records = await prisma.officeExpense.findMany({
        where: { billUpload: { contains: url }, ...(!staff ? { submittedById: req.user!.employeeId ?? '__none__' } : {}) },
        select: { billUpload: true },
      });
      referenced = records.some(r => r.billUpload?.split(',').map(v => v.trim()).includes(url));
    } else {
      referenced = !!await prisma.policy.findFirst({ where: { filePath: url }, select: { id: true } });
    }
    if (!referenced) { res.status(404).json({ success: false, message: 'Attachment not found.' }); return; }
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.download(path.join(uploadsDirectory, filename), filename, error => { if (error) next(error); });
  } catch (error) { next(error); }
});

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
    fs.writeFileSync(path.join(uploadsDirectory, filename), f.buffer);
    return `/api/uploads/${filename}`;
  });
  res.json({ success: true, urls });
});

export default router;
