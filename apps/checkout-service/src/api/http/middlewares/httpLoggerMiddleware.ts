import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { container } from '@di/RootModule';
import type { Elysia } from 'elysia';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';

export const httpLoggerMiddleware = (app: Elysia) => {
  const logger = container
    .get<LoggerPort>(SharedCoreDITokens.Logger)
    .fromContext('HTTP');

  const start = Date.now();

  app.onRequest(({ server, request }) => {
    logger.info(`Incoming request: ${request.method} ${request.url}`, {
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

