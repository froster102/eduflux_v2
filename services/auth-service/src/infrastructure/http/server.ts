import { Hono } from 'hono';
import { auth } from 'src/infrastructure/auth/auth';
import { AUTH_SERVICE } from 'src/shared/constants/services';
import { Logger } from 'src/shared/utils/logger';
import { notFoundHandler } from './middleware/not-found-handler.middleware';
import { httpLoggerMiddleware } from './middleware/http-logger.middleware';
import Bun from 'bun';
import { errorHandler } from './middleware/error-handler.middleware';

export class Server {
  private _app: Hono;
  private _port: number;
  private _logger = new Logger(AUTH_SERVICE);

  constructor(port: number) {
    this._app = new Hono();
    this._port = port;
  }

  private _setup(): void {
    this._app.use(httpLoggerMiddleware);
    this._app.on(['POST', 'GET'], '/api/auth/*', (c) => {
      return auth.handler(c.req.raw);
    });
    this._app.notFound(notFoundHandler);
    this._app.onError(errorHandler);
  }

  private _setupRoutes(): void {}

  start(): void {
    try {
      this._setup();
      this._setupRoutes();

      Bun.serve({
        fetch: this._app.fetch,
        port: this._port,
      });
      this._logger.info(`[AUTH_SERVICE] listening on port ${this._port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
