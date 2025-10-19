import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionPaymentSuccessfullEventHandler } from '@core/application/session/handler/SessionPaymentSucessfullEventHandler';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import type { EventBusPort } from '@core/common/port/message/EventBusPort';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { SessionStatus } from '@core/domain/session/enum/SessionStatus';
import { SessionEvents } from '@core/domain/session/events/enum/SessionEvents';
import type { SessionConfimedEvent } from '@core/domain/session/events/SessionConfirmedEvent';
import type { SessionPaymentSuccessfullEvent } from '@core/domain/session/events/SessionPaymentSuccessfullEvent';
import { inject } from 'inversify';

export class SessionPaymentSuccessfullEventHandlerService
  implements SessionPaymentSuccessfullEventHandler
{
  private logger: LoggerPort;

  constructor(
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
    @inject(CoreDITokens.Logger) logger: LoggerPort,
    @inject(CoreDITokens.EventBus) private readonly eventBus: EventBusPort,
  ) {
    this.logger = logger.fromContext(
      SessionPaymentSuccessfullEventHandlerService.name,
    );
  }

  async handle(event: SessionPaymentSuccessfullEvent): Promise<void> {
    const { sessionId, paymentId } = event;

    const session = CoreAssert.notEmpty(
      await this.sessionRepository.findById(sessionId),
      new NotFoundException('Session not found.'),
    );

    if (session.status === SessionStatus.CONFIRMED) {
      this.logger.warn(`Session has already completed ${session.id}`);
      return;
    }

    session.markAsConfirmed(paymentId);

    await this.sessionRepository.update(session.id, session);

    //Send event to SESSION_TOPIC to trigger notification
    const sessionConfirmedEvent: SessionConfimedEvent = {
      type: SessionEvents.SESSION_CONFIRMED,
      id: session.id,
      sessionId: session.id,
      learnerId: session.learnerId,
      instructorId: session.instructorId,
      status: session.status,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      path: `/sessions/${session.id}`,
      occuredAt: new Date().toISOString(),
    };
    await this.eventBus.sendEvent(sessionConfirmedEvent);
  }
}
