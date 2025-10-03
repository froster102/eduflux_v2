import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type {
  StartSessionOnJoinUseCase,
  StartSessionOnPort,
} from '@core/application/session/usecase/StartSessionOnJoinUseCase';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import type { EventBusPort } from '@core/common/port/message/EventBusPort';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { SessionStatus } from '@core/domain/session/enum/SessionStatus';
import { SessionEvents } from '@core/domain/session/events/enum/SessionEvents';
import type { SessionUpdatedEvent } from '@core/domain/session/events/SessionUpdatedEvent';
import { inject } from 'inversify';

export class StartSessionOnJoinService implements StartSessionOnJoinUseCase {
  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
    @inject(CoreDITokens.EventBus) private readonly eventBus: EventBusPort,
  ) {}

  async execute(payload: StartSessionOnPort): Promise<void> {
    const { sessionId } = payload;

    const session = CoreAssert.notEmpty(
      await this.sessionRepository.findById(sessionId),
      new NotFoundException('Session not found.'),
    );

    const isPreStartStatus = session.status === SessionStatus.BOOKED;

    if (isPreStartStatus) {
      session.markAsProgress();

      await this.sessionRepository.update(session.id, session);

      const sessionUpdatedEvent: SessionUpdatedEvent = {
        id: session.id,
        type: SessionEvents.SESSION_UPDATED,
        sessionId: session.id,
        learnerId: session.learnerId,
        instructorId: session.instructorId,
        status: session.status,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime.toISOString(),
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
        occuredAt: new Date().toISOString(),
      };

      await this.eventBus.sendEvent(sessionUpdatedEvent);
    }
  }
}
