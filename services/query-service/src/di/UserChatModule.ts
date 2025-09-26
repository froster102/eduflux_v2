import { UserChatController } from "@api/http-rest/controller/UserChatController";
import { UserChatDITokens } from "@core/application/user-chat/di/UserChatDITokens";
import type { UserChatCreatedEventHandler } from "@core/application/user-chat/handler/UserChatCreateEventHandler";
import type { UserChatRepositoryPort } from "@core/application/user-chat/port/persistence/UserChatRepositoryPort";
import { UserChatCreatedEventHandlerService } from "@core/application/user-chat/service/handler/UserChatCreatedEventHandlerService";
import { GetUserChatsService } from "@core/application/user-chat/service/usecase/GetUserChatsService";
import type { GetUserChatsUseCase } from "@core/application/user-chat/usecase/GetUserChatsUseCase";
import { MongooseUserChatRepositoryAdapter } from "@infrastructure/adapter/persistence/mongoose/repository/user-chat/MongooseUserChatRepositoryAdapter";
import { ContainerModule } from "inversify";

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

    //Repository
    options
      .bind<UserChatRepositoryPort>(UserChatDITokens.UserChatRepository)
      .to(MongooseUserChatRepositoryAdapter);

    //Controller
    options
      .bind<UserChatController>(UserChatDITokens.UserChatController)
      .to(UserChatController);
  },
);
