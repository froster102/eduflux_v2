import { NextFunction, Request, Response } from 'express';
import { AUTH_SERVICE } from '@/shared/constants/services';
import { Logger } from '@/shared/utils/logger';

export const httpLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const logger = new Logger(AUTH_SERVICE);

  const start = Date.now();
  const { method, originalUrl } = req;

  logger.info(`Incomming request: ${method} ${originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const logLevel = statusCode >= 400 ? 'error' : 'info';
    logger[logLevel](`Request completed: ${method} ${originalUrl}`, {
      statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
