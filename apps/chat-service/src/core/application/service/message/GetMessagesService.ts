import { ChatDITokens } from '@core/application/chat/di/ChatDITokens';
import type { ChatRepositoryPort } from '@core/application/chat/port/persistence/ChatRepositoryPort';
import { MessageDITokens } from '@core/application/message/di/MessageDITokens';
import { ChatAccessForbiddenException } from '@core/application/chat/exceptions/ChatAccessForbiddenException';
import { ChatNotFoundException } from '@core/application/chat/exceptions/ChatNotFoundException';
import type { MessageRepositoryPort } from '@core/application/message/port/persistence/MessageRepositoryPort';
import type { GetMessagesUseCasePort } from '@core/application/message/port/usecase/GetMessagesPort';
import { MessageUseCaseDto } from '@core/application/message/usecase/dto/MessageUseCaseDto';
import type { GetMessagesUseCase } from '@core/application/message/usecase/GetMessagesUseCase';
import type { GetMessagesUseCaseResult } from '@core/application/message/usecase/type/GetMessagesUseCaseResult';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { inject } from 'inversify';

export class GetMessagesService implements GetMessagesUseCase {
  constructor(
    @inject(ChatDITokens.ChatRepository)
    private readonly chatRepository: ChatRepositoryPort,
    @inject(MessageDITokens.MessageRepository)
    private readonly messageRepository: MessageRepositoryPort,
  ) {}

  async execute(
    payload: GetMessagesUseCasePort,
  ): Promise<GetMessagesUseCaseResult> {
    const { chatId, userId, queryParameters } = payload;
    const chat = CoreAssert.notEmpty(
      await this.chatRepository.findById(chatId),
      new ChatNotFoundException(chatId),
    );

    CoreAssert.isTrue(
      chat.isParticipant(userId),
      new ChatAccessForbiddenException(chatId, userId),
    );

    const result = await this.messageRepository.findByChatId(
      chatId,
      queryParameters,
    );

    return {
      messages: MessageUseCaseDto.fromEntities(result.messages),
      totalCount: result.totalCount,
    };
  }
}
