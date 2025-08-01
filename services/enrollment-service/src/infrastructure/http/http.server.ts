import type { ILogger } from '@/shared/common/interface/logger.interface';
import Elysia from 'elysia';
import { httpLoggerMiddleware } from './middlewares/http-logger.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import { TYPES } from '@/shared/di/types';
import { container } from '@/shared/di/container';
import { EnrollmentRoutes } from '@/interface/routes/enrollment.routes';
import { correlationIdSetupMiddleware } from './middlewares/correlation-id-setup.middleware';

export class Server {
  private app: Elysia;
  private port: number;
  private logger = container
    .get<ILogger>(TYPES.Logger)
    .fromContext('HTTP_SERVER');
  private enrollmentRoutes: EnrollmentRoutes;

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
    this.enrollmentRoutes = container.get<EnrollmentRoutes>(
      TYPES.EnrollmentRoutes,
    );
  }

  private setupMiddlewares(): void {
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(httpLoggerMiddleware);
    this.app.use(errorHandler);
  }

  private setupRoutes(): void {
    this.app.get('/api/enrollments/ok', () => ({ ok: true }));
    this.app.use(this.enrollmentRoutes.setupRoutes());
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
