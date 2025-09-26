import { ProgressController } from '@application/api/http-rest/controller/ProgressController';
import { UserController } from '@application/api/http-rest/controller/UserController';
import { correlationIdSetupMiddleware } from '@application/api/http-rest/middleware/correlation-id-setup.middleware';
import { errorHandler } from '@application/api/http-rest/middleware/error-handler.middleware';
import { httpLoggerMiddleware } from '@application/api/http-rest/middleware/http-logger.middleware';
import { container } from '@application/di/RootModule';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/LoggerPort';
import { ProgressDITokens } from '@core/domain/progress/di/ProgressDITokens';
import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { HttpServerConfig } from '@infrastructure/config/HttpServerConfig';
import { USER_SERVICE } from '@shared/constants/services';
import Elysia from 'elysia';

export class HttpServer {
  private app: Elysia;
  private port: number = HttpServerConfig.PORT;
  private logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext('HTTP_SERVER');

  constructor() {
    this.app = new Elysia();
  }

  private setupMiddlewares(): void {
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(httpLoggerMiddleware);
    this.app.use(errorHandler);
  }

  private setupRoutes(): void {
    this.app.get('/health', () => ({ ok: true }));
    const userRoutes = container.get<UserController>(
      UserDITokens.UserController,
    );
    const progressRoutes = container.get<ProgressController>(
      ProgressDITokens.ProgressController,
    );
    this.app.use(userRoutes.register());
    this.app.use(progressRoutes.register());
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      this.app.listen(this.port);
      this.logger.info(`[${USER_SERVICE}] listening on port ${this.port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
