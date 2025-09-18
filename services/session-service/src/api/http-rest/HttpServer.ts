import { graphqlHandler } from '@api/graphql/graphql-handler';
import { errorHandler } from '@api/http-rest/middlewares/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@api/http-rest/middlewares/httpLoggerMiddleware';
import { SessionSettingsDITokens } from '@core/application/session-settings/di/SessionSettingsDITokens';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { container } from '@di/RootModule';
import { SESSION_SERVICE } from '@shared/constants/services';
import Elysia from 'elysia';
import type { ScheduleController } from '@api/http-rest/controller/SchedulerController';
import { SessionSettingsController } from '@api/http-rest/controller/SessionSettingsController';
import { HttpServerConfig } from '@shared/config/HttpServerConfig';
import { correlationIdSetupMiddleware } from '@api/http-rest/middlewares/correlationIdMiddleware';

export class HttpServer {
  private app: Elysia;
  private port: number;
  private logger: LoggerPort;
  private readonly scheduleController: ScheduleController;
  private readonly sessionSettingsController: SessionSettingsController;

  constructor() {
    this.app = new Elysia();
    this.port = HttpServerConfig.PORT;
    this.logger = container
      .get<LoggerPort>(CoreDITokens.Logger)
      .fromContext('HTTP_SERVER');
    this.scheduleController = container.get<ScheduleController>(
      SessionDITokens.ScheduleController,
    );
    this.sessionSettingsController = container.get<SessionSettingsController>(
      SessionSettingsDITokens.SessionSettingsController,
    );
  }

  private setupMiddlewares(): void {
    this.app.use(httpLoggerMiddleware);
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(errorHandler);
    this.app.use(graphqlHandler);
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
