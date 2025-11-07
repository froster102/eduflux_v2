import { ChatDITokens } from '@core/application/chat/di/ChatDITokens';
import { UserChatCreatedEvent } from '@core/application/views/user-chat/events/UserChatCreatedEvent';
import { ChatAlreadyExistsException } from '@core/application/chat/exceptions/ChatAlreadyExistsException';
import { InstructorNotFoundException } from '@core/application/chat/exceptions/InstructorNotFoundException';
import { NoInstructorRoleException } from '@core/application/chat/exceptions/NoInstructorRoleException';
import type { ChatRepositoryPort } from '@core/application/chat/port/persistence/ChatRepositoryPort';
import type { CreateChatPort } from '@core/application/chat/port/usecase/CreateChatPort';
import type { CreateChatUseCase } from '@core/application/chat/usecase/CreateChatUseCase';
import { ChatUseCaseDto } from '@core/application/chat/usecase/dto/ChatUseCaseDto';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { Role } from '@eduflux-v2/shared/constants/Role';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { Chat } from '@core/domain/chat/entity/Chat';
import { inject } from 'inversify';
import { v4 as uuidV4 } from 'uuid';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';

export class CreateChatService implements CreateChatUseCase {
  constructor(
    @inject(SharedCoreDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(ChatDITokens.ChatRepository)
    private readonly chatRepository: ChatRepositoryPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}

  async execute(payload: CreateChatPort): Promise<ChatUseCaseDto> {
    const { userId, instructorId } = payload;

    const instructor = CoreAssert.notEmpty(
      await this.userService.getUser(instructorId),
      new InstructorNotFoundException(instructorId),
    );

    CoreAssert.isTrue(
      instructor.roles.includes(Role.INSTRUCTOR),
      new NoInstructorRoleException(),
    );

    const existingChat = await this.chatRepository.findExistingChat([
      userId,
      instructorId,
    ]);

    if (existingChat) {
      throw new ChatAlreadyExistsException([userId, instructorId]);
    }

    const chat = Chat.new({
      id: uuidV4(),
      participants: [
        { userId, role: Role.LEARNER },
        { userId: instructorId, role: Role.INSTRUCTOR },
      ],
      lastMessagePreview: '',
      lastMessageAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.chatRepository.save(chat);

    const chatUseCaseDto = ChatUseCaseDto.fromEntity(chat);

    const userChatCreatedEvent: UserChatCreatedEvent = new UserChatCreatedEvent(
      chat.id,
      {
        ...chatUseCaseDto,
        createdAt: chatUseCaseDto.createdAt.toISOString(),
        lastMessageAt: chatUseCaseDto.lastMessageAt.toISOString(),
        updatedAt: chatUseCaseDto.updatedAt.toISOString(),
      },
    );

    await this.messageBroker.publish(userChatCreatedEvent);

    return chatUseCaseDto;
  }
}
