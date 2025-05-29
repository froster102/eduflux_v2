import { Request, Response } from 'express';
import httpStatus from 'http-status';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(httpStatus.NOT_EXTENDED).json({
    statusCode: httpStatus.NOT_FOUND,
    message: httpStatus[httpStatus.NOT_FOUND],
    path: req.originalUrl,
  });
}
