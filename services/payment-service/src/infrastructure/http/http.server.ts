import type { ILogger } from '@/shared/common/interface/logger.interface';
import Elysia from 'elysia';
import { TYPES } from '@/shared/di/types';
import { container } from '@/shared/di/container';
import { PAYMENT_SERVICE } from '@/shared/constants/service';
import { httpLoggerMiddleware } from './middleware/http-logger.middleware';
import { errorHandler } from './middleware/error-handler.middleware';
import { PaymentRoutes } from '@/interface/routes/payment.route';

export class Server {
  private app: Elysia;
  private port: number;
  private logger = container
    .get<ILogger>(TYPES.Logger)
    .fromContext('HTTP_SERVER');
  private paymentRoutes: PaymentRoutes;

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
    this.paymentRoutes = container.get<PaymentRoutes>(TYPES.PaymentRoutes);
  }

  private setupMiddlewares(): void {
    this.app.use(httpLoggerMiddleware);
    this.app.use(errorHandler);
  }

  private setupRoutes(): void {
    this.app.get('/api/payments/ok', () => ({ ok: true }));
    this.app.use(this.paymentRoutes.setupRoutes());
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
