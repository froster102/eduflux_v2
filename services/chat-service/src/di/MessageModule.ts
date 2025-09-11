import { MessageDITokens } from "@core/application/message/di/MessageDITokens";
import type { MessageRepositoryPort } from "@core/application/message/port/persistence/MessageRepositoryPort";
import type { CreateMessageUseCase } from "@core/application/message/usecase/CreateMessageUseCase";
import type { GetMessagesUseCase } from "@core/application/message/usecase/GetMessagesUseCase";
import type { UpdateMessageStatusUseCase } from "@core/application/message/usecase/UpdateMessageStatusUseCase";
import { CreateMessageService } from "@core/application/service/message/CreateMessageService";
import { GetMessagesService } from "@core/application/service/message/GetMessagesService";
import { UpdateMessageStatusService } from "@core/application/service/message/UpdateMessageStatusService";
import { MongooseMessageRepositoryAdapter } from "@infrastructure/adapter/persistence/mongoose/repository/MongooseMessageRepositoryAdapter";
import { ContainerModule } from "inversify";

export const messageModule: ContainerModule = new ContainerModule((options) => {
  //Use-cases
  options
    .bind<CreateMessageUseCase>(MessageDITokens.CreateMessageUseCase)
    .to(CreateMessageService);
  options
    .bind<GetMessagesUseCase>(MessageDITokens.GetMessagesUseCase)
    .to(GetMessagesService);
  options
    .bind<UpdateMessageStatusUseCase>(
      MessageDITokens.UpdateMessageStatusUseCase,
    )
    .to(UpdateMessageStatusService);

  //Repository
  options
    .bind<MessageRepositoryPort>(MessageDITokens.MessageRepository)
    .to(MongooseMessageRepositoryAdapter);
});
