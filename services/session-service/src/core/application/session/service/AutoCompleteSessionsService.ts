import { inject } from 'inversify';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type { MeetingServicePort } from '@core/application/session/port/gateway/MeetingServicePort';
import { SessionStatus } from '@core/domain/session/enum/SessionStatus';
import type { AutoCompleteSessionsUseCase } from '@core/application/session/usecase/AutoCompleteSessionsUseCase';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { tryCatch } from '@shared/utils/try-catch';
import { SessionEvents } from '@core/domain/session/events/enum/SessionEvents';
import type { EventBusPort } from '@core/common/port/message/EventBusPort';
import type { SessionCompletedEvent } from '@core/domain/session/events/SessionCompletedEvent';

export class AutoCompleteSessionsService
  implements AutoCompleteSessionsUseCase
{
  private readonly logger: LoggerPort;
  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
    @inject(SessionDITokens.MeetingService)
    private readonly meetingService: MeetingServicePort,
    @inject(CoreDITokens.EventBus) private readonly eventBus: EventBusPort,
    @inject(CoreDITokens.Logger)
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

      const sessionUpdatedEvent: SessionCompletedEvent = {
        id: session.id,
        type: SessionEvents.SESSION_COMPLETED,
        sessionId: session.id,
        learnerId: session.learnerId,
        instructorId: session.instructorId,
        status: SessionStatus.COMPLETED,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime.toISOString(),
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
        occuredAt: new Date().toISOString(),
      };
      await this.eventBus.sendEvent(sessionUpdatedEvent);

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
