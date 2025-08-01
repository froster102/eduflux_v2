import Elysia from 'elysia';
import { httpLoggerMiddleware } from './middlewares/http-logger.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import { container } from '@/shared/di/container';
import { AdminRoutes } from '@/interface/routes/admin.route';
import { TYPES } from '@/shared/di/types';
import { InstructorRoutes } from '@/interface/routes/course.routes';
import { LearnerRoutes } from '@/interface/routes/learner.routes';
import { CourseRoutes } from '@/interface/routes/user.routes';
import { correlationIdSetupMiddleware } from './middlewares/correlation-id-setup.middleware';
import type { ILogger } from '@/shared/common/interfaces/logger.interface';
import { injectable } from 'inversify';

@injectable()
export class Server {
  private app: Elysia;
  private port: number;
  private logger = container.get<ILogger>(TYPES.Logger).fromContext('HTTP');

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
  }

  private setupMiddlewares(): void {
    this.app.use(correlationIdSetupMiddleware);
    this.app.use(httpLoggerMiddleware);
    this.app.use(errorHandler);
  }

  private setupRoutes(): void {
    this.app.get('/api/courses/health', () => ({ ok: true }));
    const adminRoutes = container.get<AdminRoutes>(TYPES.AdminRoutes);
    const instructorRoutes = container.get<InstructorRoutes>(
      TYPES.InstructorRoutes,
    );
    const courseRoutes = container.get<CourseRoutes>(TYPES.CourseRoutes);
    const learnerRoutes = container.get<LearnerRoutes>(TYPES.LearnerRoutes);
    this.app.use(adminRoutes.register());
    this.app.use(instructorRoutes.register());
    this.app.use(learnerRoutes.register());
    this.app.use(courseRoutes.register());
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      this.app.listen(this.port);
      this.logger.info(`listening on port ${this.port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
