import { Hono } from 'hono';
import { auth } from '@/lib/better-auth/auth';
import { logger as loggerUtils } from '@/shared/utils/logger';
import { httpLoggerMiddleware } from '@/http/middleware/httpLoggerMiddleware';
import { notFoundHandler } from '@/http/middleware/notFoundHandlerMiddleware';
import { errorHandler } from '@/http/middleware/errorHandlerMiddleware';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { AUTH_SERVICE } from '@/shared/constants/services';

export class HttpServer {
  private readonly port: number;
  private readonly logger: LoggerPort;
  private readonly app: Hono;

  constructor(port: number) {
    this.port = port;
    this.logger = loggerUtils.fromContext('HTTP_SERVER');
    this.app = new Hono();
    this.setupMiddlewares();
    this.setupAuthRoutes();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.app.use(httpLoggerMiddleware);
    this.app.onError(errorHandler);
    this.app.notFound(notFoundHandler);
  }

  private setupAuthRoutes(): void {
    this.app.on(['POST', 'GET'], '/api/auth/*', (c) => {
      return auth.handler(c.req.raw);
    });
  }

  private setupRoutes(): void {
    this.app.get('/health', (c) => {
      return c.json({ status: 'ok' });
    });
  }

  start(): void {
    try {
      Bun.serve({
        fetch: this.app.fetch,
        port: this.port,
      });
      this.logger.info(`[${AUTH_SERVICE}] listening on port ${this.port}`);
    } catch (error) {
      this.logger.error('Failed to start HTTP server', { error });
      process.exit(1);
    }
  }
}
