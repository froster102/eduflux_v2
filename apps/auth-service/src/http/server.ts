import { Logger } from '@/shared/utils/logger';
import { Hono } from 'hono';
import { httpLoggerMiddleware } from './middleware/http-logger.middleware';
import { notFoundHandler } from './middleware/not-found-handler.middleware';
import { errorHandler } from './middleware/error-handler.middleware';
import { auth } from '@/lib/auth';
import { serverConfig } from '@/shared/config/server.config';
import { AUTH_SERVICE } from '@/shared/constants/services';

const app = new Hono();

const logger = new Logger(AUTH_SERVICE);

app.use(httpLoggerMiddleware);
app.notFound(notFoundHandler);
app.onError(errorHandler);

//health check route
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

export function startServer() {
  Bun.serve({
    fetch: app.fetch,
    port: serverConfig.PORT,
  });

  logger.info(`[${AUTH_SERVICE}] listening on port ${serverConfig.PORT}`);
}
