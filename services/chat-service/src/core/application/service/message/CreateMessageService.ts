import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import type { ChatRepositoryPort } from "@core/application/chat/port/persistence/ChatRepositoryPort";
import { MessageDITokens } from "@core/application/message/di/MessageDITokens";
import { ChatAccessForbiddenException } from "@core/application/chat/exceptions/ChatAccessForbiddenException";
import { ChatNotFoundException } from "@core/application/chat/exceptions/ChatNotFoundException";
import type { MessageRepositoryPort } from "@core/application/message/port/persistence/MessageRepositoryPort";
import type { CreateMessagePort } from "@core/application/message/port/usecase/CreateMessagePort";
import type { CreateMessageUseCase } from "@core/application/message/usecase/CreateMessageUseCase";
import { MessageStatus } from "@core/common/enum/MessageStatus";
import { CoreAssert } from "@core/common/util/assert/CoreAssert";
import { Message } from "@core/domain/message/entity/Message";
import { inject } from "inversify";
import { v4 as uuidV4 } from "uuid";
import { MessageUseCaseDto } from "@core/application/message/usecase/dto/MessageUseCaseDto";

export class CreateMessageService implements CreateMessageUseCase {
  constructor(
    @inject(ChatDITokens.ChatRepository)
    private readonly chatRepository: ChatRepositoryPort,
    @inject(MessageDITokens.MessageRepository)
    private readonly messageRepository: MessageRepositoryPort,
  ) {}

  async execute(payload: CreateMessagePort): Promise<MessageUseCaseDto> {
    const { chatId, content, senderId } = payload;

    const chat = CoreAssert.notEmpty(
      await this.chatRepository.findById(payload.chatId),
      new ChatNotFoundException(chatId),
    );

    CoreAssert.isTrue(
      chat.isParticipant(senderId),
      new ChatAccessForbiddenException(chatId, senderId),
    );

    const message = Message.new({
      id: uuidV4(),
      chatId,
      senderId,
      content,
      status: MessageStatus.SENT,
      isRead: false,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    //Perform transaction!!!!
    await this.chatRepository.update(chatId, { lastMessageAt: new Date() });
    await this.messageRepository.save(message);

    return MessageUseCaseDto.fromEntity(message);
  }
}
