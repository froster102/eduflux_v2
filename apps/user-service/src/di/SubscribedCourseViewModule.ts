import { SubscribedCourseViewDITokens } from '@application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { SubscribedCourseViewRepositoryPort } from '@application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import { GetSubscribedCourseViewsService } from '@application/views/subscribed-course/service/usecase/GetSubscribedCourseViewsService';
import type { GetSubscribedCourseViewsUseCase } from '@application/views/subscribed-course/usecase/GetSubscribedCourseViewsUseCase';
import { MongooseSubscribedCourseViewRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repositories/subscribed-course/MongooseSubscribedCourseViewRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const SubscribedCourseViewModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-case
    options
      .bind<GetSubscribedCourseViewsUseCase>(
        SubscribedCourseViewDITokens.GetSubscribedCourseViewsUseCase,
      )
      .to(GetSubscribedCourseViewsService);

    //Repository
    options
      .bind<SubscribedCourseViewRepositoryPort>(
        SubscribedCourseViewDITokens.SubscribedCourseViewRepository,
      )
      .to(MongooseSubscribedCourseViewRepositoryAdapter);
  },
);
