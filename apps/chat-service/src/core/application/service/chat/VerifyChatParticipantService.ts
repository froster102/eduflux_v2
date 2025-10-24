import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import { ChatNotFoundException } from "@core/application/chat/exceptions/ChatNotFoundException";
import type { ChatRepositoryPort } from "@core/application/chat/port/persistence/ChatRepositoryPort";
import type { VerifyChatParticipantPort } from "@core/application/chat/port/usecase/VerifyChatParticipantPort";
import type { VerifyChatParticipantUseCaseResult } from "@core/application/chat/usecase/type/VerifyChatParticipantUseCaseResult";
import type { VerifyChatParticipantUseCase } from "@core/application/chat/usecase/VerifyChatParticipantUseCase";
import { CoreAssert } from "@core/common/util/assert/CoreAssert";
import { inject } from "inversify";

export class VerifyChatParticipantService
  implements VerifyChatParticipantUseCase
{
  constructor(
    @inject(ChatDITokens.ChatRepository)
    private readonly chatRepository: ChatRepositoryPort,
  ) {}

  async execute(
    payload: VerifyChatParticipantPort,
  ): Promise<VerifyChatParticipantUseCaseResult> {
    const { chatId, userId } = payload;

    const chat = CoreAssert.notEmpty(
      await this.chatRepository.findById(chatId),
      new ChatNotFoundException(chatId),
    );

    return { isParticipant: chat.isParticipant(userId) };
  }
}
