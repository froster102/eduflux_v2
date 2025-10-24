import { inject } from "inversify";

import { UserChatDITokens } from "@core/application/views/user-chat/di/UserChatDITokens";
import type { UserChatCreatedEvent } from "@core/application/views/user-chat/events/UserChatCreatedEvent";
import type { UserChatCreatedEventHandler } from "@core/application/views/user-chat/handler/UserChatCreateEventHandler";
import type { UserChatRepositoryPort } from "@core/application/views/user-chat/port/persistence/UserChatRepositoryPort";

import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import type { UserServicePort } from "@core/common/gateway/UserServicePort";
import { UserChat } from "@core/application/views/user-chat/entity/UserChat";

export class UserChatCreatedEventHandlerService
  implements UserChatCreatedEventHandler
{
  private readonly logger: LoggerPort;

  constructor(
    @inject(CoreDITokens.Logger) logger: LoggerPort,
    @inject(UserChatDITokens.UserChatRepository)
    private readonly userChatRepository: UserChatRepositoryPort,
    @inject(CoreDITokens.UserService)
    private readonly userService: UserServicePort,
  ) {
    this.logger = logger.fromContext(UserChatCreatedEventHandlerService.name);
  }

  async handle(event: UserChatCreatedEvent): Promise<void> {
    const { id, participants, lastMessageAt, createdAt } = event;

    try {
      const participantsData = await Promise.all(
        participants.map(async (participant) => {
          const user = await this.userService.getUser(participant.userId);
          if (!user) {
            this.logger.warn(`User with ID ${participant.userId} not found.`);
            return null;
          }
          return {
            id: user.id,
            name: user.firstName + " " + user.lastName,
            image: user.image,
            role: participant.role,
          };
        }),
      );

      const validParticipants = participantsData.filter((p) => p !== null);

      const userChat = UserChat.new({
        id,
        lastMessageAt,
        createdAt,
        participants: validParticipants,
        lastMessagePreview: null,
      });

      await this.userChatRepository.save(userChat);

      this.logger.info(
        `Successfully created UserChat read model for chatId: ${id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to handle UserChatCreatedEvent for chatId ${id}: ${
          (error as Error)?.message
        }`,
        error as Record<string, any>,
      );
    }
  }
}
