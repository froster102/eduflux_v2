import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type {
  StartSessionOnJoinUseCase,
  StartSessionOnPort,
} from '@core/application/session/usecase/StartSessionOnJoinUseCase';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { EventBusPort } from '@eduflux-v2/shared/ports/message/EventBusPort';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';
import { SessionEvents } from '@eduflux-v2/shared/events/session/enum/SessionEvents';
import type { SessionUpdatedEvent } from '@eduflux-v2/shared/events/session/SessionUpdatedEvent';
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
        timestamp: new Date().toISOString(),
      };

      await this.eventBus.sendEvent(sessionUpdatedEvent);
    }
  }
}
