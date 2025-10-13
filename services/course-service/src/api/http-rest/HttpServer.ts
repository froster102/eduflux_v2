import { errorHandler } from '@api/http-rest/middlewares/errorHandlerMiddleware';
import { httpLoggerMiddleware } from '@api/http-rest/middlewares/httpLoggerMiddleware';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { container } from '@di/RootModule';
import Elysia from 'elysia';
import { HttpServerConfig } from '@shared/config/HttpServerConfig';
import { correlationIdSetupMiddleware } from '@api/http-rest/middlewares/correlationIdMiddleware';
import type { CourseController } from '@api/http-rest/controller/CourseController';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import { COURSE_SERVICE } from '@shared/constants/services';
import type { ChapterController } from '@api/http-rest/controller/ChapterController';
import type { LectureController } from '@api/http-rest/controller/LectureController';
import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';

export class HttpServer {
  private app: Elysia;
  private port: number;
  private logger: LoggerPort;
  private readonly courseController: CourseController;
  private readonly chapterController: ChapterController;
  private readonly lectureController: LectureController;

  constructor() {
    this.app = new Elysia();
    this.port = HttpServerConfig.PORT;
    this.logger = container
      .get<LoggerPort>(CoreDITokens.Logger)
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
