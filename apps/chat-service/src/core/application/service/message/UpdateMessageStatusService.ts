import { ChatDITokens } from '@core/application/chat/di/ChatDITokens';
import type { ChatRepositoryPort } from '@core/application/chat/port/persistence/ChatRepositoryPort';
import { MessageDITokens } from '@core/application/message/di/MessageDITokens';
import { ChatAccessForbiddenException } from '@core/application/chat/exceptions/ChatAccessForbiddenException';
import { ChatNotFoundException } from '@core/application/chat/exceptions/ChatNotFoundException';
import type { MessageRepositoryPort } from '@core/application/message/port/persistence/MessageRepositoryPort';
import type { UpdateMessageStatusPort } from '@core/application/message/port/usecase/UpdateMessageStatusPort';
import type { UpdateMessageStatusUseCase } from '@core/application/message/usecase/UpdateMessageStatusUseCase';
import { inject } from 'inversify';
import { MessageNotFoundException } from '@core/application/message/exceptions/MessageNotFoundException';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { MessageStatus } from '@eduflux-v2/shared/constants/MessageStatus';

export class UpdateMessageStatusService implements UpdateMessageStatusUseCase {
  constructor(
    @inject(ChatDITokens.ChatRepository)
    private readonly chatRepository: ChatRepositoryPort,
    @inject(MessageDITokens.MessageRepository)
    private readonly messageRepository: MessageRepositoryPort,
  ) {}

  async execute(payload: UpdateMessageStatusPort): Promise<void> {
    const { chatId, executorId, messageId, status } = payload;
    const chat = CoreAssert.notEmpty(
      await this.chatRepository.findById(chatId),
      new ChatNotFoundException(chatId),
    );

    CoreAssert.isTrue(
      chat.isParticipant(executorId),
      new ChatAccessForbiddenException(chatId, executorId),
    );

    const message = CoreAssert.notEmpty(
      await this.messageRepository.findById(messageId),
      new MessageNotFoundException(chatId, messageId),
    );

    if (message.senderId === executorId) {
      if (status === MessageStatus.DELIVERED || status === MessageStatus.READ) {
        throw new ForbiddenException();
      }
    }

    message.updateStatus(status);

    await this.messageRepository.update(message.id, message);
  }
}
