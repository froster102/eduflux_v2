import { inject } from 'inversify';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type { MeetingServicePort } from '@core/application/session/port/gateway/MeetingServicePort';
import type { AutoCompleteSessionsUseCase } from '@core/application/session/usecase/AutoCompleteSessionsUseCase';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import { SessionEvents } from '@eduflux-v2/shared/events/session/enum/SessionEvents';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { SessionCompletedEvent } from '@eduflux-v2/shared/events/session/SessionCompletedEvent';
import { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';

export class AutoCompleteSessionsService
  implements AutoCompleteSessionsUseCase
{
  private readonly logger: LoggerPort;
  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
    @inject(SessionDITokens.MeetingService)
    private readonly meetingService: MeetingServicePort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
    @inject(SharedCoreDITokens.Logger)
    logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(AutoCompleteSessionsService.name);
  }

  public async execute(): Promise<void> {
    const safetyBufferMinutes = 5;
    const cutoffTime = new Date(Date.now() - safetyBufferMinutes * 60 * 1000);

    const updatedSessions =
      await this.sessionRepository.findAndUpdateOverdueSessions(
        [SessionStatus.IN_PROGRESS],
        cutoffTime,
        SessionStatus.COMPLETED,
      );

    if (updatedSessions.length === 0) {
      this.logger.info('No overdue sessions found for cleanup.');
      return;
    }

    this.logger.info(
      `Found ${updatedSessions.length} sessions requiring auto-completion.`,
    );

    for (const session of updatedSessions) {
      this.logger.info(
        `Forcefully deleting meeting room for session: ${session.id}`,
      );
      const { error } = await tryCatch(
        this.meetingService.deleteRoom(session.id),
      );

      const sessionUpdatedEvent = new SessionCompletedEvent(session.id, {
        sessionId: session.id,
        learnerId: session.learnerId,
        instructorId: session.instructorId,
        status: SessionStatus.COMPLETED,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime.toISOString(),
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      });
      await this.messageBroker.publish(sessionUpdatedEvent);

      if (error) {
        this.logger.error(
          `Error processing overdue session ${session.id}. Failed to complete or clean up.`,
          error as Record<string, any>,
        );
      }
    }
    this.logger.info('Finished processing overdue sessions.');
  }
}
