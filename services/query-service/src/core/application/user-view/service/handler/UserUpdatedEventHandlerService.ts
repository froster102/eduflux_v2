import { inject } from "inversify";
import type { UserUpdatedEvent } from "@core/application/user-view/events/UserUpdatedEvent";
import type { UserUpdatedEventHandler } from "@core/application/user-view/handler/UserUpdatedEventHandler";
import { InstructorViewDITokens } from "@core/application/instructor-view/di/InstructorViewDITokens";
import type { InstructorViewRepositoryPort } from "@core/application/instructor-view/port/persistence/InstructorViewRepositoryPort";
import { UserChatDITokens } from "@core/application/user-chat/di/UserChatDITokens";
import type { UserChatRepositoryPort } from "@core/application/user-chat/port/persistence/UserChatRepositoryPort";
import { UserSessionDITokens } from "@core/application/user-session/di/UserSessionDITokens";
import type { UserSessionRepositoryPort } from "@core/application/user-session/port/persistence/UserSessionRepositoryPort";

export class UserUpdatedEventHandlerService implements UserUpdatedEventHandler {
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,

    @inject(UserChatDITokens.UserChatRepository)
    private readonly userChatRepository: UserChatRepositoryPort,

    @inject(UserSessionDITokens.UserSessionRepository)
    private readonly userSessionRepository: UserSessionRepositoryPort,
  ) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    const { id: userId, name, image, bio } = event;

    const payload = {
      name,
      image,
      bio,
    };

    //perform transaction
    await this.instructorViewRepository.updateUser(userId, payload);
    await this.userChatRepository.updateUser(userId, payload);
    await this.userSessionRepository.updateUser(userId, payload);
  }
}
