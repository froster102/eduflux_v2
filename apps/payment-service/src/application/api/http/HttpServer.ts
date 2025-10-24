import { correlationIdSetupMiddleware } from '@application/api/http/middleware/correlationIdMiddleware';
import { errorHandler } from '@application/api/http/middleware/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@application/api/http/middleware/httpLoggerMiddleware';
import { container } from '@application/di/RootModule';
import type { PaymentController } from '@payment/controller/PaymentController';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';
import { CoreDITokens } from '@shared/common/di/CoreDITokens';
import type { LoggerPort } from '@shared/common/port/logger/LoggerPort';
import { HttpServerConfig } from '@shared/config/HttpServerConfig';
import { PAYMENT_SERVICE } from '@shared/constants/service';
import Elysia from 'elysia';

export class HttpServer {
  private app: Elysia;
  private port: number;
  private logger: LoggerPort;
  private readonly paymentController: PaymentController;

  constructor() {
    this.app = new Elysia();
    this.port = HttpServerConfig.HTTP_SERVER_PORT;
    this.logger = container
      .get<LoggerPort>(CoreDITokens.Logger)
      .fromContext('HTTP_SERVER');
    this.paymentController = container.get<PaymentController>(
      PaymentDITokens.PaymentController,
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

    this.app.use(this.paymentController.register());
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      this.app.listen(this.port);
      this.logger.info(`[${PAYMENT_SERVICE}] listening on port ${this.port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
