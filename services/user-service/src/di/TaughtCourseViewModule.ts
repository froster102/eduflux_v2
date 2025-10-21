import type { CourseCreatedEventHandler } from '@core/application/views/coordinator/handler/CourseCreatedEventHandler';
import type { CoursePublishedEventHandler } from '@core/application/views/coordinator/handler/CoursePublishedEventHandler';
import type { CourseUpdatedEventHandler } from '@core/application/views/coordinator/handler/CourseUpdateEventHandler';
import { CourseCreatedEventHandlerService } from '@core/application/views/coordinator/service/CourseCreatedEventHandlerService';
import { CoursePublishedEventHandlerService } from '@core/application/views/coordinator/service/CoursePublishedEventHandlerService';
import { CourseUpdatedEventHandlerService } from '@core/application/views/coordinator/service/CourseUpdatedEventHandlerService';
import { TaughtCourseViewDITokens } from '@core/application/views/taught-course/di/TaughtCourseViewDITokens';
import type { TaughtCourseViewRepositoryPort } from '@core/application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import { GetTaughtCourseViewsService } from '@core/application/views/taught-course/service/usecase/GetTaughtCourseViewsService';
import type { GetTaughtCourseViewsUseCase } from '@core/application/views/taught-course/usecase/GetTaughtCourseViewsUseCase';
import { MongooseTaughtCourseViewRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repositories/taught-course/MongooseTaughtCourseViewRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const TaughtCourseViewModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<CourseCreatedEventHandler>(
        TaughtCourseViewDITokens.CourseCreatedEventHandler,
      )
      .to(CourseCreatedEventHandlerService);
    options
      .bind<GetTaughtCourseViewsUseCase>(
        TaughtCourseViewDITokens.GetTaughtCourseViewUseCase,
      )
      .to(GetTaughtCourseViewsService);

    //Handler
    options
      .bind<CourseUpdatedEventHandler>(
        TaughtCourseViewDITokens.CourseUpdatedEventHandler,
      )
      .to(CourseUpdatedEventHandlerService);

    options
      .bind<CoursePublishedEventHandler>(
        TaughtCourseViewDITokens.CoursePublishedEventHandler,
      )
      .to(CoursePublishedEventHandlerService);

    //Repository
    options
      .bind<TaughtCourseViewRepositoryPort>(
        TaughtCourseViewDITokens.TaughtCourseViewRepository,
      )
      .to(MongooseTaughtCourseViewRepositoryAdapter);
  },
);
