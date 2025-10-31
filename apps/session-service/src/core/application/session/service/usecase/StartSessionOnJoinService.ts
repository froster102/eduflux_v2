import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type {
  StartSessionOnJoinUseCase,
  StartSessionOnPort,
} from '@core/application/session/usecase/StartSessionOnJoinUseCase';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';
import { SessionUpdatedEvent } from '@eduflux-v2/shared/events/session/SessionUpdatedEvent';
import { inject } from 'inversify';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';

export class StartSessionOnJoinService implements StartSessionOnJoinUseCase {
  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
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

      const sessionUpdatedEvent = new SessionUpdatedEvent(session.id, {
        sessionId: session.id,
        learnerId: session.learnerId,
        instructorId: session.instructorId,
        status: session.status,
        startTime: session.startTime.toISOString(),
        endTime: session.endTime.toISOString(),
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      });

      await this.messageBroker.publish(sessionUpdatedEvent);
    }
  }
}
