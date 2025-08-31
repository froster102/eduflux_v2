import type { EnrollmentController } from '@api/http-rest/controller/EnrollmentController';
import { correlationIdSetupMiddleware } from '@api/http-rest/middlewares/correlationIdSetup.middleware';
import { errorHandler } from '@api/http-rest/middlewares/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@api/http-rest/middlewares/httpLoggerMiddleware';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
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
    .fromContext('HTTP_SERVER');
  private enrollmentController: EnrollmentController;

  constructor() {
    this.app = new Elysia();
    this.port = HttpServerConfig.PORT;
    this.enrollmentController = container.get<EnrollmentController>(
      EnrollmentDITokens.EnrollmentController,
    );
  }

  private setupMiddlewares(): void {
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(httpLoggerMiddleware);
    this.app.use(errorHandler);
  }

  private setupRoutes(): void {
    this.app.get('/api/enrollments/ok', () => ({ ok: true }));
    this.app.use(this.enrollmentController.register());
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      this.app.listen(this.port);
      this.logger.info(`Http server listening on port ${this.port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
