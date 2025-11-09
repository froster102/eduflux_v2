import { errorHandler } from '@api/http/middlewares/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@api/http/middlewares/httpLoggerMiddleware';
import { SessionSettingsDITokens } from '@core/application/session-settings/di/SessionSettingsDITokens';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { container } from '@di/RootModule';
import { SESSION_SERVICE } from '@shared/constants/services';
import Elysia from 'elysia';
import type { SessionController } from '@api/http/controller/SessionController';
import { SessionSettingsController } from '@api/http/controller/SessionSettingsController';
import { correlationIdSetupMiddleware } from '@api/http/middlewares/correlationIdMiddleware';

export class HttpServer {
  private app: Elysia;
  private port: number;
  private logger: LoggerPort;
  private readonly scheduleController: SessionController;
  private readonly sessionSettingsController: SessionSettingsController;

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
    this.logger = container
      .get<LoggerPort>(SharedCoreDITokens.Logger)
      .fromContext('HTTP_SERVER');
    this.scheduleController = container.get<SessionController>(
      SessionDITokens.SessionController,
    );
    this.sessionSettingsController = container.get<SessionSettingsController>(
      SessionSettingsDITokens.SessionSettingsController,
    );
  }

  private setupMiddlewares(): void {
    this.app.use(httpLoggerMiddleware);
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(errorHandler);
  }

  private setupRoutes(): void {
    //health check
    this.app.get('/health', () => ({ ok: true }));

    this.app.use(this.scheduleController.register());
    this.app.use(this.sessionSettingsController.register());
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      this.app.listen(this.port);
      this.logger.info(`[${SESSION_SERVICE}] listening on port ${this.port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
