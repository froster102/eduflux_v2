import { SubscribedCourseViewDITokens } from '@core/application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { SubscribedCourseViewRepositoryPort } from '@core/application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import { GetSubscribedCourseViewsService } from '@core/application/views/subscribed-course/service/usecase/GetSubscribedCourseViewsService';
import type { GetSubscribedCourseViewsUseCase } from '@core/application/views/subscribed-course/usecase/GetSubscribedCourseViewsUseCase';
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
