import { AUTH_SERVICE } from '@/shared/constants/services';
import { Logger } from '@/shared/utils/logger';
import { createMiddleware } from 'hono/factory';
import { getConnInfo } from 'hono/bun';

export const httpLoggerMiddleware = createMiddleware(async (c, next) => {
  const logger = new Logger(AUTH_SERVICE);

  const start = Date.now();
  const { method, url } = c.req;
  const connectionInfo = getConnInfo(c);

  logger.info(`Incomming request: ${method} ${url}`, {
    ip: connectionInfo.remote.address,
    userAgent: c.req.header('User-Agent'),
  });

  await next();

  const duration = Date.now() - start;
  const statusCode = c.res.status;

  const logLevel = statusCode >= 400 ? 'error' : 'info';
  logger[logLevel](`Request completed: ${method} ${url}`, {
    statusCode,
    duration: `${duration}ms`,
  });
});
