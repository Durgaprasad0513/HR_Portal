import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { StorageError } from '../config/storage';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const correlationId = req.headers['x-correlation-id'];
  if (res.headersSent) { next(err); return; }
  if (err instanceof StorageError) {
    res.status(err.statusCode).json({ status: 'ERROR', message: err.message, correlationId }); return;
  }
  if (err instanceof multer.MulterError) {
    res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ status: 'ERROR', message: err.code === 'LIMIT_FILE_SIZE' ? 'File exceeds the 10 MB limit.' : 'Invalid file upload.', correlationId }); return;
  }
  console.error(`[${correlationId}] Unhandled Error:`, err?.message, err?.stack);

  res.status(500).json({
    status: 'ERROR',
    message: 'Internal server error',
    correlationId,
    error: process.env.NODE_ENV === 'development' ? err?.message : undefined,
  });
};
