import { ChatController } from "@api/http-rest/controller/ChatController";
import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import type { ChatRepositoryPort } from "@core/application/chat/port/persistence/ChatRepositoryPort";
import type { CreateChatUseCase } from "@core/application/chat/usecase/CreateChatUseCase";
import type { GetChatsUseCase } from "@core/application/chat/usecase/GetChatsUseCase";
import type { GetChatUseCase } from "@core/application/chat/usecase/GetChatUseCase";
import { CreateChatService } from "@core/application/service/chat/CreateChatService";
import { GetChatService } from "@core/application/service/chat/GetChatService";
import { GetChatsService } from "@core/application/service/chat/GetChatsService";
import { MongooseChatRepositoryAdapter } from "@infrastructure/adapter/persistence/mongoose/repository/MongooseChatRepositoryAdapter";
import { ContainerModule } from "inversify";

export const chatModule: ContainerModule = new ContainerModule((options) => {
  //Use-cases
  options
    .bind<CreateChatUseCase>(ChatDITokens.CreateChatUseCase)
    .to(CreateChatService);
  options
    .bind<GetChatsUseCase>(ChatDITokens.GetChatsUseCase)
    .to(GetChatsService);
  options.bind<GetChatUseCase>(ChatDITokens.GetChatUseCase).to(GetChatService);

  //Controller
  options.bind<ChatController>(ChatDITokens.ChatController).to(ChatController);

  //Repository
  options
    .bind<ChatRepositoryPort>(ChatDITokens.ChatRepository)
    .to(MongooseChatRepositoryAdapter);
});
