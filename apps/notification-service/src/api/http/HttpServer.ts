import type { NotificationController } from '@api/http/controller/NotificationController';
import { correlationIdSetupMiddleware } from '@api/http/middlewares/correlationIdSetupMiddleware';
import { errorHandler } from '@api/http/middlewares/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@api/http/middlewares/httpLoggerMiddleware';
import { NotificationDITokens } from '@core/application/notification/di/NotificationDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { container } from '@di/RootModule';
import Elysia from 'elysia';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';

export class HttpServer {
  private app: Elysia;
  private port: number;
  private logger = container
    .get<LoggerPort>(SharedCoreDITokens.Logger)
    .fromContext(HttpServer.name);
  private notificationController: NotificationController;

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
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
