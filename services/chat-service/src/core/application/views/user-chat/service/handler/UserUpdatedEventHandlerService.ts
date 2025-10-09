import { UserChatDITokens } from "@core/application/views/user-chat/di/UserChatDITokens";
import type { UserUpdatedEvent } from "@core/application/views/user-chat/events/UserUpdatedEvent";
import type { UserUpdatedEventHandler } from "@core/application/views/user-chat/handler/UserUpdatedEventHandler";
import type { UserChatRepositoryPort } from "@core/application/views/user-chat/port/persistence/UserChatRepositoryPort";
import { inject } from "inversify";

export class UserUpdatedEventHandlerService implements UserUpdatedEventHandler {
  constructor(
    @inject(UserChatDITokens.UserChatRepository)
    private readonly userSessionRepository: UserChatRepositoryPort,
  ) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    const { id: userId, name, image, bio } = event;

    const payload = {
      name,
      image,
      bio,
    };

    await this.userSessionRepository.updateUser(userId, payload);
  }
}
