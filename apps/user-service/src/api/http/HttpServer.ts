import { ProgressController } from 'src/api/http/controller/ProgressController';
import { UserController } from 'src/api/http/controller/UserController';
import { correlationIdSetupMiddleware } from '@api/http/middleware/correlationIdSetupMiddleware';
import { errorHandler } from '@api/http/middleware/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@api/http/middleware/httpLoggerMiddleware';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { ProgressDITokens } from '@application/progress/di/ProgressDITokens';
import { UserDITokens } from '@application/user/di/UserDITokens';
import { HttpServerConfig } from '@infrastructure/config/HttpServerConfig';
import { USER_SERVICE } from '@shared/constants/services';
import Elysia from 'elysia';
import { container } from '@di/RootModule';

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
