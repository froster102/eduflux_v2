import express, { Express } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from 'src/infrastructure/auth/auth';
import { AUTH_SERVICE } from 'src/shared/constants/services';
import { Logger } from 'src/shared/utils/logger';
import { notFoundHandler } from './middleware/not-found-handler.middleware';
import { httpLoggerMiddleware } from './middleware/http-logger.middleware';
import cors from 'cors';
import { serverConfig } from 'src/shared/config/server.config';

export class Server {
  private _app: Express;
  private _port: number;
  private _logger = new Logger(AUTH_SERVICE);

  constructor(port: number) {
    this._app = express();
    this._port = port;
  }

  private _setupPreMiddleware(): void {
    this._app.use(
      cors({
        origin: [serverConfig.CLIENT_URL],
        methods: [
          'GET',
          'POST',
          'PUT',
          'PATCH',
          'DELETE',
          'CONNECT',
          'OPTIONS',
          'TRACE',
          'HEAD',
        ],
      }),
    );
    this._app.use(httpLoggerMiddleware);
    this._app.all('/api/auth/*splat', toNodeHandler(auth));
  }

  private _setupPostMiddleware(): void {
    this._app.use(express.json());
  }

  private _setupErrorHandlers() {
    this._app.use(notFoundHandler);
  }

  private _setupRoutes(): void {}

  start(): void {
    try {
      this._setupPreMiddleware();
      this._setupPostMiddleware();
      this._setupRoutes();
      this._setupErrorHandlers();

      this._app.listen(this._port, () => {
        this._logger.info(`[AUTH_SERVICE] listening on port ${this._port}`);
      });
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
