import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type { ConfirmSessionBookingPort } from '@core/application/session/port/usecase/ConfirmBookingPort';
import type { ConfirmSessionBookingUseCase } from '@core/application/session/usecase/ConfirmSessionBookingUseCase';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import type { EventBusPort } from '@core/common/port/message/EventBusPort';
import { SessionEvents } from '@core/domain/session/events/SessionEvents';
import { inject } from 'inversify';

export class ConfirmSessionBookingService
  implements ConfirmSessionBookingUseCase
{
  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
    @inject(CoreDITokens.EventBus) private readonly eventBus: EventBusPort,
  ) {}

  async execute(payload: ConfirmSessionBookingPort): Promise<void> {
    const { sessionId, paymentId } = payload;

    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new NotFoundException(`Session with ID:${sessionId} not found.`);
    }

    session.markAsBooked(paymentId);

    await this.sessionRepository.update(session.id, session);

    //Send event to SESSION_TOPIC to trigger notification
    await this.eventBus.sendEvent({
      type: SessionEvents.SESSION_CONFIRMED,
      correlationId: '',
      data: {
        sessionId: session.id,
        learnerId: session.learnerId,
        instructorId: session.instructorId,
        status: session.status,
        startTime: session.startTime,
        endTime: session.endTime,
        path: `/sessions/${session.id}`,
      },
    });
  }
}
