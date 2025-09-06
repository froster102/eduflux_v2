import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import type { ChatRepositoryPort } from "@core/application/chat/port/persistence/ChatRepositoryPort";
import type { GetChatPort } from "@core/application/chat/port/usecase/GetChatPort";
import { ChatUseCaseDto } from "@core/application/chat/usecase/dto/ChatUseCaseDto";
import type { GetChatUseCase } from "@core/application/chat/usecase/GetChatUseCase";
import type { GetChatUseCaseResult } from "@core/application/chat/usecase/type/GetChatUseCaseResult";
import { inject } from "inversify";

export class GetChatService implements GetChatUseCase {
  constructor(
    @inject(ChatDITokens.ChatRepository)
    private readonly chatRepository: ChatRepositoryPort,
  ) {}

  async execute(payload: GetChatPort): Promise<GetChatUseCaseResult> {
    const { learnerId, instructorId } = payload;
    const chat = await this.chatRepository.findExistingChat([
      learnerId,
      instructorId,
    ]);
    if (chat) {
      return { chat: ChatUseCaseDto.fromEntity(chat) };
    }
    return {
      chat: null,
    };
  }
}
