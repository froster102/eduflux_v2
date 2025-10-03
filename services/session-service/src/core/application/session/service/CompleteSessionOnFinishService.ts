import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type { MeetingServicePort } from '@core/application/session/port/gateway/MeetingServicePort'; // <-- New Port Import
import { SessionStatus } from '@core/domain/session/enum/SessionStatus';
import { inject } from 'inversify';
import type {
  CompleteSessionOnFinishPort,
  CompleteSessionOnFinishUseCase,
} from '@core/application/session/usecase/CompleteSessionOnFinishUseCase';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { tryCatch } from '@shared/utils/try-catch';

export class CompleteSessionOnFinishService
  implements CompleteSessionOnFinishUseCase
{
  private readonly logger: LoggerPort;
  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
    @inject(SessionDITokens.MeetingService)
    private readonly meetingService: MeetingServicePort,
    @inject(CoreDITokens.Logger) logger: LoggerPort,
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
    if (session.endTime >= new Date() && isActiveStatus) {
      session.markAsCompleted();
      await this.sessionRepository.update(session.id, session);
    } else {
      return;
    }

    const { error } = await tryCatch(this.meetingService.deleteRoom(sessionId));
    if (error) {
      this.logger.error(
        `Failed to delete LiveKit room ${sessionId}:`,
        error as Record<string, any>,
      );
    }
  }
}
