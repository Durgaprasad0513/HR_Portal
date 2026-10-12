import fs from 'fs';
import path from 'path';

// Mount this directory on durable storage in production. URLs remain stable.
export const uploadsDirectory = path.resolve(process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(uploadsDirectory, { recursive: true });
