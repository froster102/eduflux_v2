import { errorHandler } from '@api/http/middlewares/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@api/http/middlewares/httpLoggerMiddleware';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { container } from '@di/RootModule';
import Elysia from 'elysia';
import { correlationIdSetupMiddleware } from '@api/http/middlewares/correlationIdMiddleware';
import type { CourseController } from '@api/http/controller/CourseController';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import { COURSE_SERVICE } from '@shared/constants/services';
import type { ChapterController } from '@api/http/controller/ChapterController';
import type { LectureController } from '@api/http/controller/LectureController';
import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { EnrollmentController } from '@api/http/controller/EnrollmentController';
import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';

export class HttpServer {
  private app: Elysia;
  private port: number;
  private logger: LoggerPort;
  private readonly courseController: CourseController;
  private readonly chapterController: ChapterController;
  private readonly lectureController: LectureController;
  private readonly enrollmentController: EnrollmentController;

  constructor(port: number) {
    this.app = new Elysia();
    this.port = port;
    this.logger = container
      .get<LoggerPort>(SharedCoreDITokens.Logger)
      .fromContext('HTTP_SERVER');
    this.courseController = container.get<CourseController>(
      CourseDITokens.CourseController,
    );
    this.chapterController = container.get<ChapterController>(
      ChapterDITokens.ChapterController,
    );
    this.lectureController = container.get<LectureController>(
      LectureDITokens.LectureController,
    );
    this.enrollmentController = container.get<EnrollmentController>(
      EnrollmentDITokens.EnrollmentController,
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

    this.app.use(this.courseController.register());
    this.app.use(this.chapterController.register());
    this.app.use(this.lectureController.register());
    this.app.use(this.enrollmentController.register());
  }

  start(): void {
    try {
      this.setupMiddlewares();
      this.setupRoutes();

      this.app.listen(this.port);
      this.logger.info(`[${COURSE_SERVICE}] listening on port ${this.port}`);
    } catch (error) {
      console.error(`Faild to start service`, error);
      process.exit(1);
    }
  }
}
