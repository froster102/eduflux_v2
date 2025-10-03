import { UserSessionDITokens } from "@core/application/user-session/di/UserSessionDITokens";
import type { UserSessionUpdatedEventHandler } from "@core/application/user-session/handler/UserSessionUpdatedEventHandler";
import type { UserSessionRepositoryPort } from "@core/application/user-session/port/persistence/UserSessionRepositoryPort";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import { NotFoundException } from "@core/common/exception/NotFoundException";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import type { UserSessionUpdatedEvent } from "@core/domain/user-session/events/SessionUpdatedEvent";
import { inject } from "inversify";

export class UserSessionUpdatedEventHandlerService
  implements UserSessionUpdatedEventHandler
{
  private readonly logger: LoggerPort;
  constructor(
    @inject(UserSessionDITokens.UserSessionRepository)
    private readonly userSessionRepository: UserSessionRepositoryPort,
    @inject(CoreDITokens.Logger)
    logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(
      UserSessionUpdatedEventHandlerService.name,
    );
  }

  async handle(event: UserSessionUpdatedEvent): Promise<void> {
    const { sessionId, status, updatedAt } = event;

    const userSession = await this.userSessionRepository.findById(sessionId);

    if (!userSession) {
      this.logger.error("UserSession aggregate not found for ID: ${sessionId}");
      throw new NotFoundException(
        `UserSession aggregate not found for ID: ${sessionId}`,
      );
    }

    userSession.updateStatus(status);
    userSession.updatedAt = new Date(updatedAt);

    await this.userSessionRepository.update(userSession.getId(), userSession);
  }
}
