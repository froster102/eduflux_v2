import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import type { UserSessionUpdatedEventSubscriber } from '@core/application/views/user-session/subscriber/UserSessionUpdatedEventSubscriber';
import type { UserUpdatedEventSubscriber } from '@core/application/views/user-session/subscriber/UserUpdatedEventSubscriber';
import type { UserSessionRepositoryPort } from '@core/application/views/user-session/port/persistence/UserSessionRepositoryPort';
import { UserSessionUpdatedEventSubscriberService } from '@core/application/views/user-session/service/subscriber/UserSessionUpdatedEventSubscriberService';
import { UserUpdatedEventSubscriberService } from '@core/application/views/user-session/service/subscriber/UserUpdatedEventSubscriberService';
import { GetUserSessionService } from '@core/application/views/user-session/service/usecase/GetUserSessionsService';
import type { GetUserSessionsUseCase } from '@core/application/views/user-session/usecase/GetUserSessionsUseCase';
import { MongooseUserSessionRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/user-session/MongooseUserSessionRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const UserSessionModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-case
    options
      .bind<GetUserSessionsUseCase>(UserSessionDITokens.GetUserSessionsUseCase)
      .to(GetUserSessionService);

    //Subscribers
    options
      .bind<UserSessionUpdatedEventSubscriber>(
        UserSessionDITokens.UserSessionUpdatedEventSubscriber,
      )
      .to(UserSessionUpdatedEventSubscriberService);
    options
      .bind<UserUpdatedEventSubscriber>(
        UserSessionDITokens.UserUpdatedEventSubscriber,
      )
      .to(UserUpdatedEventSubscriberService);

    //Repository
    options
      .bind<UserSessionRepositoryPort>(
        UserSessionDITokens.UserSessionRepository,
      )
      .to(MongooseUserSessionRepositoryAdapter);
  },
);
