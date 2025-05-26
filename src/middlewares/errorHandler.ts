import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';

export const errorHandler = (
  err: Error | MongoError | MongooseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Handle MongoDB duplicate key errors
  if (err.name === 'MongoServerError' && 'code' in err && err.code === 11000) {
    const mongoErr = err as MongoError & { keyPattern: Record<string, unknown> };
    return res.status(409).json({
      message: 'Duplicate key error',
      field: Object.keys(mongoErr.keyPattern)[0]
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message
    });
  }

  // Default error handler
  res.status(500).json({
    message: 'Internal server error'
  });
};
