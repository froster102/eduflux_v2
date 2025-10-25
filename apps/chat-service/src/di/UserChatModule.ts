import { UserChatDITokens } from '@core/application/views/user-chat/di/UserChatDITokens';
import type { UserChatCreatedEventHandler } from '@core/application/views/user-chat/handler/UserChatCreateEventHandler';
import type { UserUpdatedEventHandler } from '@core/application/views/user-chat/handler/UserUpdatedEventHandler';
import type { UserChatRepositoryPort } from '@core/application/views/user-chat/port/persistence/UserChatRepositoryPort';
import { UserChatCreatedEventHandlerService } from '@core/application/views/user-chat/service/handler/UserChatCreatedEventHandlerService';
import { UserUpdatedEventHandlerService } from '@core/application/views/user-chat/service/handler/UserUpdatedEventHandlerService';
import { GetUserChatsService } from '@core/application/views/user-chat/service/usecase/GetUserChatsService';
import type { GetUserChatsUseCase } from '@core/application/views/user-chat/usecase/GetUserChatsUseCase';
import { MongooseUserChatRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/user-chat/MongooseUserChatRepositoryAdapter';
import { ContainerModule } from 'inversify';

export const UserChatModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<GetUserChatsUseCase>(UserChatDITokens.GetUserChatsUserCase)
      .to(GetUserChatsService);

    //Handler
    options
      .bind<UserChatCreatedEventHandler>(
        UserChatDITokens.UserChatCreatedEventHandler,
      )
      .to(UserChatCreatedEventHandlerService);
    options
      .bind<UserUpdatedEventHandler>(UserChatDITokens.UserUpdatedEventHandler)
      .to(UserUpdatedEventHandlerService);

    //Repository
    options
      .bind<UserChatRepositoryPort>(UserChatDITokens.UserChatRepository)
      .to(MongooseUserChatRepositoryAdapter);
  },
);
