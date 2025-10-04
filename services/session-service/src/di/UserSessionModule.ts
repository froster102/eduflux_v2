import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import type { ConfirmSessionEventHandler } from '@core/application/views/user-session/handler/ConfirmSessionHandler';
import type { UserSessionUpdatedEventHandler } from '@core/application/views/user-session/handler/UserSessionUpdatedEventHandler';
import type { UserUpdatedEventHandler } from '@core/application/views/user-session/handler/UserUpdatedEventHandler';
import type { UserSessionRepositoryPort } from '@core/application/views/user-session/port/persistence/UserSessionRepositoryPort';
import { ConfirmSessionEventHandlerService } from '@core/application/views/user-session/service/handler/ConfirmSessionEventHandlerService';
import { UserSessionUpdatedEventHandlerService } from '@core/application/views/user-session/service/handler/UserSessionUpdateEventHandlerService';
import { UserUpdatedEventHandlerService } from '@core/application/views/user-session/service/handler/UserUpdatedEventHandlerService';
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

    //Handlers
    options
      .bind<ConfirmSessionEventHandler>(
        UserSessionDITokens.ConfirmSessionEventHandler,
      )
      .to(ConfirmSessionEventHandlerService);
    options
      .bind<UserSessionUpdatedEventHandler>(
        UserSessionDITokens.UserSessionUpdatedEventHandler,
      )
      .to(UserSessionUpdatedEventHandlerService);
    options
      .bind<UserUpdatedEventHandler>(
        UserSessionDITokens.UserUpdatedEventHandler,
      )
      .to(UserUpdatedEventHandlerService);

    //Repository
    options
      .bind<UserSessionRepositoryPort>(
        UserSessionDITokens.UserSessionRepository,
      )
      .to(MongooseUserSessionRepositoryAdapter);
  },
);
