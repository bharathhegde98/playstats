import { Context } from 'hono';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { ResponseHelper } from '../utils/response';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, c: Context) => {
  logger.error('Error occurred', err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return ResponseHelper.error(
      c,
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
    );
  }

  // Handle custom app errors
  if (err instanceof AppError) {
    return ResponseHelper.error(c, err.code, err.message, err.statusCode, err.details);
  }

  // Handle unexpected errors
  const isDev = process.env.NODE_ENV === 'development';
  return ResponseHelper.error(
    c,
    'INTERNAL_SERVER_ERROR',
    isDev ? err.message : 'An unexpected error occurred',
    500,
    isDev ? { stack: err.stack } : undefined
  );
};
