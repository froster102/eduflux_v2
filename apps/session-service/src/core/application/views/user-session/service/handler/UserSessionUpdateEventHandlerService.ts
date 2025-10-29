import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import type { UserSessionUpdatedEvent } from '@core/application/views/user-session/events/SessionUpdatedEvent';
import type { UserSessionUpdatedEventHandler } from '@core/application/views/user-session/handler/UserSessionUpdatedEventHandler';
import type { UserSessionRepositoryPort } from '@core/application/views/user-session/port/persistence/UserSessionRepositoryPort';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { inject } from 'inversify';

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
      this.logger.error('UserSession aggregate not found for ID: ${sessionId}');
      throw new NotFoundException(
        `UserSession aggregate not found for ID: ${sessionId}`,
      );
    }

    userSession.updateStatus(status);
    userSession.updatedAt = new Date(updatedAt);

    await this.userSessionRepository.update(userSession.id, userSession);
  }
}
