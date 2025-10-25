import type { NotificationController } from '@api/http/controller/NotificationController';
import { correlationIdSetupMiddleware } from '@api/http/middlewares/correlationIdSetupMiddleware';
import { errorHandler } from '@api/http/middlewares/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@api/http/middlewares/httpLoggerMiddleware';
import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { container } from '@di/RootModule';
import { HttpServerConfig } from '@shared/config/HttpServerConfig';
import Elysia from 'elysia';

export class HttpServer {
  private app: Elysia;
  private port: number;
  private logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext(HttpServer.name);
  private notificationController: NotificationController;

  constructor() {
    this.app = new Elysia();
    this.port = HttpServerConfig.PORT;
    this.notificationController = container.get<NotificationController>(
      NotificationDITokens.NotificationController,
    );
  }

  private setupMiddlewares(): void {
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(httpLoggerMiddleware);
    this.app.use(errorHandler);
  }

  private setupRoutes(): void {
    this.app.get('/health', () => ({
      message: 'Api running successfully.',
    }));
    this.app.use(this.notificationController.register());
  }

  start() {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      this.app.listen(this.port);
      this.logger.info(`Http server listening on port ${this.port}`);
    } catch (error) {
      console.error(`Failed to start service.`, error);
      process.exit(1);
    }
  }
}
