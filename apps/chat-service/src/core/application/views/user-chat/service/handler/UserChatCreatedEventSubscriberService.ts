import { inject } from 'inversify';

import { UserChatDITokens } from '@core/application/views/user-chat/di/UserChatDITokens';
import type { UserChatCreatedEventSubscriber } from '@core/application/views/user-chat/subscriber/UserChatCreatedEventSubscriber';
import type { UserChatRepositoryPort } from '@core/application/views/user-chat/port/persistence/UserChatRepositoryPort';

import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { UserChat } from '@core/application/views/user-chat/entity/UserChat';
import { UserChatCreatedEvent } from '@core/application/chat/events/UserChatCreatedEvent';

export class UserChatCreatedEventSubscriberService
  implements UserChatCreatedEventSubscriber
{
  private readonly logger: LoggerPort;

  constructor(
    @inject(SharedCoreDITokens.Logger) logger: LoggerPort,
    @inject(UserChatDITokens.UserChatRepository)
    private readonly userChatRepository: UserChatRepositoryPort,
    @inject(SharedCoreDITokens.UserService)
    private readonly userService: UserServicePort,
  ) {
    this.logger = logger.fromContext(
      UserChatCreatedEventSubscriberService.name,
    );
  }

  async on(event: UserChatCreatedEvent): Promise<void> {
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
            name: user.firstName + ' ' + user.lastName,
            image: user?.image || '',
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

  subscribedTo() {
    return [UserChatCreatedEvent];
  }
}
