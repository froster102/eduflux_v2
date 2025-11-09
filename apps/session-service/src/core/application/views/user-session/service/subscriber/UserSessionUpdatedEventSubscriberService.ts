import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import type { UserSessionUpdatedEventSubscriber } from '@core/application/views/user-session/subscriber/UserSessionUpdatedEventSubscriber';
import type { UserSessionRepositoryPort } from '@core/application/views/user-session/port/persistence/UserSessionRepositoryPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { inject } from 'inversify';
import { SessionCompletedEvent } from '@eduflux-v2/shared/events/session/SessionCompletedEvent';
import { SessionUpdatedEvent } from '@eduflux-v2/shared/events/session/SessionUpdatedEvent';

export class UserSessionUpdatedEventSubscriberService
  implements UserSessionUpdatedEventSubscriber
{
  private readonly logger: LoggerPort;
  constructor(
    @inject(UserSessionDITokens.UserSessionRepository)
    private readonly userSessionRepository: UserSessionRepositoryPort,
    @inject(SharedCoreDITokens.Logger)
    logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(
      UserSessionUpdatedEventSubscriberService.name,
    );
  }

  async on(event: SessionUpdatedEvent | SessionCompletedEvent): Promise<void> {
    const sessionId = event.payload.sessionId;
    const status = event.payload.status;
    const updatedAt = event.payload.updatedAt;

    const userSession = await this.userSessionRepository.findById(sessionId);

    if (!userSession) {
      this.logger.error(`UserSession aggregate not found for ID: ${sessionId}`);
      throw new NotFoundException(
        `UserSession aggregate not found for ID: ${sessionId}`,
      );
    }

    userSession.updateStatus(status);
    userSession.updatedAt = new Date(updatedAt);

    await this.userSessionRepository.update(userSession.id, userSession);
  }

  subscribedTo() {
    return [SessionUpdatedEvent, SessionCompletedEvent];
  }
}
