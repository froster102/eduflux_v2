import { correlationIdSetupMiddleware } from '@application/api/http/middleware/correlationIdMiddleware';
import { errorHandler } from '@application/api/http/middleware/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@application/api/http/middleware/httpLoggerMiddleware';
import { container } from '@application/di/RootModule';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import type { PaymentController } from '@payment/controller/PaymentController';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';
import { PAYMENT_SERVICE } from '@shared/constants/service';
import Elysia from 'elysia';

export class HttpServer {
  private app: Elysia;
  private port: number;
  private logger: LoggerPort;
  private readonly paymentController: PaymentController;

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
    this.logger = container
      .get<LoggerPort>(SharedCoreDITokens.Logger)
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
