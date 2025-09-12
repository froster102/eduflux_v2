import { ChatController } from "@api/http-rest/controller/ChatController";
import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import type { ChatRepositoryPort } from "@core/application/chat/port/persistence/ChatRepositoryPort";
import type { CreateChatUseCase } from "@core/application/chat/usecase/CreateChatUseCase";
import type { GetChatsUseCase } from "@core/application/chat/usecase/GetChatsUseCase";
import type { GetChatWithInstructorUseCase } from "@core/application/chat/usecase/GetChatWithInstructorUseCase";
import type { VerifyChatParticipantUseCase } from "@core/application/chat/usecase/VerifyChatParticipantUseCase";
import { CreateChatService } from "@core/application/service/chat/CreateChatService";
import { GetChatWithInstructorService } from "@core/application/service/chat/GetChatWithInstructorService";
import { GetChatsService } from "@core/application/service/chat/GetChatsService";
import { VerifyChatParticipantService } from "@core/application/service/chat/VerifyChatParticipantService";
import { MongooseChatRepositoryAdapter } from "@infrastructure/adapter/persistence/mongoose/repository/MongooseChatRepositoryAdapter";
import { ContainerModule } from "inversify";
import type { GetChatUseCase } from "@core/application/chat/usecase/GetChatUseCase";
import { GetChatService } from "@core/application/service/chat/GetChatService";

export const chatModule: ContainerModule = new ContainerModule((options) => {
  //Use-cases
  options
    .bind<CreateChatUseCase>(ChatDITokens.CreateChatUseCase)
    .to(CreateChatService);
  options
    .bind<GetChatsUseCase>(ChatDITokens.GetChatsUseCase)
    .to(GetChatsService);
  options
    .bind<GetChatWithInstructorUseCase>(
      ChatDITokens.GetChatWithInstructorUseCase,
    )
    .to(GetChatWithInstructorService);
  options.bind<GetChatUseCase>(ChatDITokens.GetChatUseCase).to(GetChatService);
  options
    .bind<VerifyChatParticipantUseCase>(
      ChatDITokens.VerifyChatParticipantUseCase,
    )
    .to(VerifyChatParticipantService);

  //Controller
  options.bind<ChatController>(ChatDITokens.ChatController).to(ChatController);

  //Repository
  options
    .bind<ChatRepositoryPort>(ChatDITokens.ChatRepository)
    .to(MongooseChatRepositoryAdapter);
});
