import os

os.makedirs('server/src/modules/upload', exist_ok=True)

code = """import { Router } from 'express';
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
    cb(null, ${Date.now()}-);
  }
});
const upload = multer({ storage });
const router = Router();

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = /api/uploads/;
  res.json({ success: true, url: fileUrl });
});

export default router;
"""

with open('server/src/modules/upload/upload.routes.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Created upload.routes.ts")
