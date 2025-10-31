import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type { MeetingServicePort } from '@core/application/session/port/gateway/MeetingServicePort';
import { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';
import { inject } from 'inversify';
import type {
  CompleteSessionOnFinishPort,
  CompleteSessionOnFinishUseCase,
} from '@core/application/session/usecase/CompleteSessionOnFinishUseCase';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import { SessionCompletedEvent } from '@eduflux-v2/shared/events/session/SessionCompletedEvent';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';

export class CompleteSessionOnFinishService
  implements CompleteSessionOnFinishUseCase
{
  private readonly logger: LoggerPort;
  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
    @inject(SessionDITokens.MeetingService)
    private readonly meetingService: MeetingServicePort,
    @inject(SharedCoreDITokens.Logger) logger: LoggerPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {
    this.logger = logger.fromContext(CompleteSessionOnFinishService.name);
  }

  public async execute(payload: CompleteSessionOnFinishPort): Promise<void> {
    const { sessionId } = payload;
    const session = CoreAssert.notEmpty(
      await this.sessionRepository.findById(sessionId),
      new NotFoundException('Session not found.'),
    );

    const isActiveStatus = session.status === SessionStatus.IN_PROGRESS;
    const isPastEndTime = session.endTime <= new Date();

    if (isPastEndTime && isActiveStatus) {
      session.markAsCompleted();
      await this.sessionRepository.update(session.id, session);

      const sessionCompletedEvent = new SessionCompletedEvent(session.id, {
        sessionId: session.id,
        learnerId: session.learnerId,
        instructorId: session.instructorId,
        status: SessionStatus.COMPLETED,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime.toISOString(),
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      });

      await this.messageBroker.publish(sessionCompletedEvent);
    } else {
      return;
    }

    const { error } = await tryCatch(this.meetingService.deleteRoom(sessionId));
    if (error) {
      this.logger.error(
        `Failed to delete meeting room ${sessionId}:`,
        error as Record<string, any>,
      );
    }
  }
}
