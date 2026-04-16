import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Prevent "headers already sent" issues
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Handle Postgres errors
  if ('code' in err) {
    const pgError = err as Error & { code: string };
    if (pgError.code === '23505') {
      res.status(409).json({
        success: false,
        message: 'A record with this value already exists.',
      });
      return;
    }
    if (pgError.code === '23503') {
      res.status(400).json({
        success: false,
        message: 'Referenced record does not exist.',
      });
      return;
    }
  }

  // Unexpected errors
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred.',
  });
};
