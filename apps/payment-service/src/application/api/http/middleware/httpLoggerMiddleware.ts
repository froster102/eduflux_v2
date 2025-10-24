import { container } from '@application/di/RootModule';
import { CoreDITokens } from '@shared/common/di/CoreDITokens';
import type { LoggerPort } from '@shared/common/port/logger/LoggerPort';
import type { Elysia } from 'elysia';

export const httpLoggerMiddleware = (app: Elysia) => {
  const logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext('HTTP');

  const start = Date.now();

  app.onRequest(({ server, request }) => {
    logger.info(`Incomming request: ${request.method} ${request.url}`, {
      ip: server!.requestIP(request)!.address,
      userAgent: request.headers.get('user-agent'),
    });
  });

  app.onAfterResponse(({ set, request }) => {
    const duration = Date.now() - start;
    const statusCode = set.status as number;
    const logLevel = statusCode >= 400 ? 'error' : 'info';
    logger[logLevel](`Request completed: ${request.method} ${request.url}`, {
      statusCode,
      duration: `${duration}ms`,
    });
  });

  return app;
};
