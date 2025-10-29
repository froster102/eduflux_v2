import { Hono } from 'hono';
import { auth } from '@/lib/better-auth/auth';
import { httpServerConfig } from '@/shared/config/httpServerConfig';
import { AUTH_SERVICE } from '@/shared/constants/services';
import { logger } from '@/shared/utils/logger';
import { httpLoggerMiddleware } from '@/http/middleware/httpLoggerMiddleware';
import { notFoundHandler } from '@/http/middleware/notFoundHandlerMiddleware';
import { errorHandler } from '@/http/middleware/errorHandlerMiddleware';

const app = new Hono();

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
    port: httpServerConfig.PORT,
  });

  logger.info(`[${AUTH_SERVICE}] listening on port ${httpServerConfig.PORT}`);
}
