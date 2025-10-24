import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import { ChatNotFoundException } from "@core/application/chat/exceptions/ChatNotFoundException";
import type { ChatRepositoryPort } from "@core/application/chat/port/persistence/ChatRepositoryPort";
import { ChatUseCaseDto } from "@core/application/chat/usecase/dto/ChatUseCaseDto";
import type {
  GetChatPort,
  GetChatUseCase,
} from "@core/application/chat/usecase/GetChatUseCase";
import { CoreAssert } from "@core/common/util/assert/CoreAssert";
import { inject } from "inversify";

export class GetChatService implements GetChatUseCase {
  constructor(
    @inject(ChatDITokens.ChatRepository)
    private readonly chatRepository: ChatRepositoryPort,
  ) {}

  async execute(payload: GetChatPort): Promise<ChatUseCaseDto> {
    const { chatId } = payload;
    const chat = CoreAssert.notEmpty(
      await this.chatRepository.findById(chatId),
      new ChatNotFoundException(chatId),
    );

    return ChatUseCaseDto.fromEntity(chat);
  }
}
