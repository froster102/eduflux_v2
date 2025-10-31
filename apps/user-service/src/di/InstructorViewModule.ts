import { InstructorViewDITokens } from '@application/views/instructor-view/di/InstructorViewDITokens';
import type { InstructorCreatedEventSubscriber } from '@application/views/instructor-view/subscriber/InstructorCreatedEventSubscriber';
import type { InstructorStatsUpdatedEventSubscriber } from '@application/views/instructor-view/subscriber/InstructorStatsUpdatedEventSubscriber';
import type { SessionSettingsUpdatedEventSubscriber } from '@application/views/instructor-view/subscriber/SessionSettingsUpdatedEventSubscriber';
import type { UserUpdatedEventSubscriber } from '@application/views/coordinator/subscriber/UserUpdatedEventSubscriber';
import type { InstructorViewRepositoryPort } from '@application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import { InstructorCreatedEventSubscriberService } from '@application/views/instructor-view/service/subscriber/InstructorCreatedEventSubscriberService';
import { InstructorStatsUpdatedEventSubscriberService } from '@application/views/instructor-view/service/subscriber/InstructorStatsUpdatedEventSubscriberService';
import { SessionSettingsUpdatedEventSubscriberService } from '@application/views/instructor-view/service/subscriber/SessionSettingsUpdatedEventSubscriberService';
import { UserUpdatedEventSubscriberService } from '@application/views/coordinator/service/subscriber/UserUpdatedEventSubscriberService';
import { GetInstructorViewService } from '@application/views/instructor-view/service/usecase/GetInstructorViewService';
import { GetInstructorViewsService } from '@application/views/instructor-view/service/usecase/GetInstructorViewsService';
import type { GetInstructorViewsUseCase } from '@application/views/instructor-view/usecase/GetInstructorViewsUseCase';
import type { GetInstructorViewUseCase } from '@application/views/instructor-view/usecase/GetInstructorViewUseCase';
import { MongooseInstructorRepositoryViewAdapter } from '@infrastructure/adapter/persistence/mongoose/repositories/instructor-view/MongooseInstructorViewRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const InstructorViewModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<GetInstructorViewsUseCase>(
        InstructorViewDITokens.GetInstructorViewsUseCase,
      )
      .to(GetInstructorViewsService);
    options
      .bind<GetInstructorViewUseCase>(
        InstructorViewDITokens.GetInstructorViewUseCase,
      )
      .to(GetInstructorViewService);

    //Repositories
    options
      .bind<InstructorViewRepositoryPort>(
        InstructorViewDITokens.InstructorViewRepository,
      )
      .to(MongooseInstructorRepositoryViewAdapter)
      .inSingletonScope();

    //Subscribers
    options
      .bind<InstructorStatsUpdatedEventSubscriber>(
        InstructorViewDITokens.InstructorStatsUpdatedEventSubscriber,
      )
      .to(InstructorStatsUpdatedEventSubscriberService)
      .inSingletonScope();
    options
      .bind<SessionSettingsUpdatedEventSubscriber>(
        InstructorViewDITokens.SessionSettingsUpdatedEventSubscriber,
      )
      .to(SessionSettingsUpdatedEventSubscriberService)
      .inSingletonScope();
    options
      .bind<InstructorCreatedEventSubscriber>(
        InstructorViewDITokens.InstructorCreatedEventSubscriber,
      )
      .to(InstructorCreatedEventSubscriberService);
    options
      .bind<UserUpdatedEventSubscriber>(
        InstructorViewDITokens.UserUpdatedEventSubscriber,
      )
      .to(UserUpdatedEventSubscriberService);
  },
);
