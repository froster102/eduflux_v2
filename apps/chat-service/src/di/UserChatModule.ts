import { UserChatDITokens } from '@core/application/views/user-chat/di/UserChatDITokens';
import type { UserChatCreatedEventSubscriber } from '@core/application/views/user-chat/subscriber/UserChatCreatedEventSubscriber';
import type { UserUpdatedEventSubscriber } from '@core/application/views/user-chat/subscriber/UserUpdatedEventSubscriber';
import type { UserChatRepositoryPort } from '@core/application/views/user-chat/port/persistence/UserChatRepositoryPort';
import { GetUserChatsService } from '@core/application/views/user-chat/service/usecase/GetUserChatsService';
import type { GetUserChatsUseCase } from '@core/application/views/user-chat/usecase/GetUserChatsUseCase';
import { MongooseUserChatRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/user-chat/MongooseUserChatRepositoryAdapter';
import { ContainerModule } from 'inversify';
import { UserChatCreatedEventSubscriberService } from '@core/application/views/user-chat/service/handler/UserChatCreatedEventSubscriberService';
import { UserUpdatedEventSubscriberService } from '@core/application/views/user-chat/service/handler/UserUpdatedEventSubscriberService';

export const UserChatModule: ContainerModule = new ContainerModule(
  (options) => {
    //Use-cases
    options
      .bind<GetUserChatsUseCase>(UserChatDITokens.GetUserChatsUserCase)
      .to(GetUserChatsService);

    //Subscribers
    options
      .bind<UserChatCreatedEventSubscriber>(
        UserChatDITokens.UserChatCreatedEventSubscriber,
      )
      .to(UserChatCreatedEventSubscriberService);
    options
      .bind<UserUpdatedEventSubscriber>(
        UserChatDITokens.UserUpdatedEventSubscriber,
      )
      .to(UserUpdatedEventSubscriberService);

    //Repository
    options
      .bind<UserChatRepositoryPort>(UserChatDITokens.UserChatRepository)
      .to(MongooseUserChatRepositoryAdapter);
  },
);
