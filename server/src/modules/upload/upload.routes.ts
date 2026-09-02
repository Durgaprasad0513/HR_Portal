import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });
const router = Router();

router.post('/', upload.array('files', 10), (req, res) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  }
  const files = req.files as Express.Multer.File[];
  const urls = files.map(f => `/api/uploads/${f.filename}`);
  res.json({ success: true, urls });
});

export default router;
