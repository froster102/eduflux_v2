import type { CourseCreatedEventSubscriber } from '@application/views/coordinator/subscriber/CourseCreatedEventSubscriber';
import type { CoursePublishedEventSubscriber } from '@application/views/coordinator/subscriber/CoursePublishedEventSubscriber';
import type { CourseUpdatedEventSubscriber } from '@application/views/coordinator/subscriber/CourseUpdatedEventSubscriber';
import { CourseCreatedEventSubscriberService } from '@application/views/coordinator/service/subscriber/CourseCreatedEventSubscriberService';
import { CoursePublishedEventSubscriberService } from '@application/views/coordinator/service/subscriber/CoursePublishedEventSubscriberService';
import { CourseUpdatedEventSubscriberService } from '@application/views/coordinator/service/subscriber/CourseUpdatedEventSubscriberService';
import { TaughtCourseViewDITokens } from '@application/views/taught-course/di/TaughtCourseViewDITokens';
import type { TaughtCourseViewRepositoryPort } from '@application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import { GetTaughtCourseViewsService } from '@application/views/taught-course/service/usecase/GetTaughtCourseViewsService';
import type { GetTaughtCourseViewsUseCase } from '@application/views/taught-course/usecase/GetTaughtCourseViewsUseCase';
import { MongooseTaughtCourseViewRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repositories/taught-course/MongooseTaughtCourseViewRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const TaughtCourseViewModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<GetTaughtCourseViewsUseCase>(
        TaughtCourseViewDITokens.GetTaughtCourseViewUseCase,
      )
      .to(GetTaughtCourseViewsService);

    //Subscribers
    options
      .bind<CourseCreatedEventSubscriber>(
        TaughtCourseViewDITokens.CourseCreatedEventSubscriber,
      )
      .to(CourseCreatedEventSubscriberService);
    options
      .bind<CourseUpdatedEventSubscriber>(
        TaughtCourseViewDITokens.CourseUpdatedEventSubscriber,
      )
      .to(CourseUpdatedEventSubscriberService);
    options
      .bind<CoursePublishedEventSubscriber>(
        TaughtCourseViewDITokens.CoursePublishedEventSubscriber,
      )
      .to(CoursePublishedEventSubscriberService);

    //Repository
    options
      .bind<TaughtCourseViewRepositoryPort>(
        TaughtCourseViewDITokens.TaughtCourseViewRepository,
      )
      .to(MongooseTaughtCourseViewRepositoryAdapter);
  },
);
