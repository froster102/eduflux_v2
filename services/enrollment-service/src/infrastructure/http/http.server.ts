import { Logger } from 'src/shared/utils/logger';
import Elysia from 'elysia';
import { httpLoggerMiddleware } from './middlewares/http-logger.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import { TYPES } from '@/shared/di/types';
import { container } from '@/shared/di/container';
import { ENROLLMENT_SERVICE } from '@/shared/constants/service';
import { EnrollmentRoutes } from '@/interface/routes/enrollment.routes';

export class Server {
  private app: Elysia;
  private port: number;
  private logger = new Logger(ENROLLMENT_SERVICE);
  private enrollmentRoutes: EnrollmentRoutes;

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
    this.enrollmentRoutes = container.get<EnrollmentRoutes>(
      TYPES.EnrollmentRoutes,
    );
  }

  private setupMiddlewares(): void {
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
      this.logger.info(
        `[${ENROLLMENT_SERVICE}] listening on port ${this.port}`,
      );
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
