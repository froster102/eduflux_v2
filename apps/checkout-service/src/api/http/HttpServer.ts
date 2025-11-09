import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { container } from '@di/RootModule';
import Elysia from 'elysia';
import { correlationIdSetupMiddleware } from '@api/http/middlewares/correlationIdMiddleware';
import type { CheckoutController } from '@api/http/controller/CheckoutController';
import { CheckoutDITokens } from '@core/application/checkout/di/CheckoutDITokens';
import { CHECKOUT_SERVICE } from '@shared/constants/services';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { httpLoggerMiddleware } from '@api/http/middlewares/httpLoggerMiddleware';
import { errorHandler } from '@api/http/middlewares/errorHandlerMiddleware';

export class HttpServer {
  private app: Elysia;
  private port: number;
  private logger: LoggerPort;
  private readonly checkoutController: CheckoutController;

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
    this.logger = container
      .get<LoggerPort>(SharedCoreDITokens.Logger)
      .fromContext('HTTP_SERVER');
    this.checkoutController = container.get<CheckoutController>(
      CheckoutDITokens.CheckoutController,
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

    this.app.use(this.checkoutController.register());
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      this.app.listen(this.port);
      this.logger.info(`[${CHECKOUT_SERVICE}] listening on port ${this.port}`);
    } catch (error) {
      console.error(`Failed to start service`, error);
      process.exit(1);
    }
  }
}
