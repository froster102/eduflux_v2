import { ChatDITokens } from "@core/application/chat/di/ChatDITokens";
import { ChatEvents } from "@core/application/chat/events/enum/ChatEvents";
import type { UserChatCreatedEvent } from "@core/application/chat/events/UserChatCreatedEvent";
import { ChatAlreadyExistsException } from "@core/application/chat/exceptions/ChatAlreadyExistsException";
import { InstructorNotFoundException } from "@core/application/chat/exceptions/InstructorNotFoundException";
import { NoInstructorRoleException } from "@core/application/chat/exceptions/NoInstructorRoleException";
import { NoUserEnrollmentException } from "@core/application/chat/exceptions/NoUserEnrollmentException";
import type { ChatRepositoryPort } from "@core/application/chat/port/persistence/ChatRepositoryPort";
import type { CreateChatPort } from "@core/application/chat/port/usecase/CreateChatPort";
import type { CreateChatUseCase } from "@core/application/chat/usecase/CreateChatUseCase";
import { ChatUseCaseDto } from "@core/application/chat/usecase/dto/ChatUseCaseDto";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import { Role } from "@core/common/enum/Role";
import type { CourseServicePort } from "@core/common/gateway/EnrollmentServicePort";
import type { UserServicePort } from "@core/common/gateway/UserServicePort";
import type { EventBusPort } from "@core/common/port/message/EventBusPort";
import { CoreAssert } from "@core/common/util/assert/CoreAssert";
import { Chat } from "@core/domain/chat/entity/Chat";
import { inject } from "inversify";
import { v4 as uuidV4 } from "uuid";

export class CreateChatService implements CreateChatUseCase {
  constructor(
    @inject(CoreDITokens.CourseService)
    private readonly courseService: CourseServicePort,
    @inject(CoreDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(ChatDITokens.ChatRepository)
    private readonly chatRepository: ChatRepositoryPort,
    @inject(CoreDITokens.EventBus) private readonly eventBus: EventBusPort,
  ) {}

  async execute(payload: CreateChatPort): Promise<ChatUseCaseDto> {
    const { userId, instructorId } = payload;

    const { hasAccess } = await this.courseService.verifyChatAccess(
      instructorId,
      userId,
    );

    if (!hasAccess) {
      throw new NoUserEnrollmentException(userId, instructorId);
    }

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
      lastMessagePreview: "",
      lastMessageAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.chatRepository.save(chat);

    const chatUseCaseDto = ChatUseCaseDto.fromEntity(chat);

    const userChatCreatedEvent: UserChatCreatedEvent = {
      type: ChatEvents.USER_CHAT_CREATED,
      ...chatUseCaseDto,
      createdAt: chatUseCaseDto.createdAt.toISOString(),
      lastMessageAt: chatUseCaseDto.lastMessageAt.toISOString(),
      updatedAt: chatUseCaseDto.updatedAt.toISOString(),
      occuredAt: new Date().toISOString(),
    };

    await this.eventBus.sendEvent(userChatCreatedEvent);

    return chatUseCaseDto;
  }
}
