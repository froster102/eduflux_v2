import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import type { Context, Next } from 'hono';
import { container } from 'src/di/RootModule';
import { getConnInfo } from '@hono/node-server/conninfo';

export const httpLoggerMiddleware = async (c: Context, next: Next) => {
  const logger = container
    .get<LoggerPort>(SharedCoreDITokens.Logger)
    .fromContext('HTTP');

  const start = Date.now();

  logger.info(`Incomming request: ${c.req.method} ${c.req.url}`, {
    ip: getConnInfo(c).remote.address,
    userAgent: c.req.header('user-agent'),
  });

  await next();

  const duration = Date.now() - start;
  const statusCode = c.res.status;
  const logLevel = statusCode >= 400 ? 'error' : 'info';
  logger[logLevel](`Request completed: ${c.req.method} ${c.req.url}`, {
    statusCode,
    duration: `${duration}ms`,
  });
};
