import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error occurred:', error);

  if (error instanceof AppError) {
    const response: ApiResponse<never> = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    res.status(error.statusCode).json(response);
    return;
  }

  const response: ApiResponse<never> = {
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  };
  res.status(500).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse<never> = {
    success: false,
    error: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  };
  res.status(404).json(response);
};
