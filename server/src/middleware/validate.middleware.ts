import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/response';

// Legacy format that assumes req.body validation
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        sendError(res, 'Validation failed', 400, errors);
      } else {
        sendError(res, 'Validation failed', 400, [{ field: 'unknown', message: error.message }]);
      }
    }
  };
};

export const validateRequest = (schemas: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query);
      if (schemas.params) req.params = schemas.params.parse(req.params);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        sendError(res, 'Validation failed', 400, errors);
      } else {
        sendError(res, 'Validation failed', 400, [{ field: 'unknown', message: error.message }]);
      }
    }
  };
};
