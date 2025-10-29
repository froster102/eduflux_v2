import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionPaymentSuccessfullEventHandler } from '@core/application/session/handler/SessionPaymentSucessfullEventHandler';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import type { EventBusPort } from '@eduflux-v2/shared/ports/message/EventBusPort';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { SessionStatus } from '@eduflux-v2/shared/constants/SessionStatus';
import { SessionEvents } from '@eduflux-v2/shared/events/session/enum/SessionEvents';
import type { SessionConfirmedEvent } from '@eduflux-v2/shared/events/session/SessionConfirmedEvent';
import type { SessionPaymentSuccessfullEvent } from '@eduflux-v2/shared/events/session/SessionPaymentSuccessfullEvent';
import { envVariables } from '@shared/env/envVariables';
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
      this.logger.warn(`Session has already confirmed ${session.id}`);
      return;
    }

    session.markAsConfirmed(paymentId);

    await this.sessionRepository.update(session.id, session);

    //Send event to SESSION_TOPIC to trigger notification
    const sessionConfirmedEvent: SessionConfirmedEvent = {
      type: SessionEvents.SESSION_CONFIRMED,
      id: session.id,
      sessionId: session.id,
      learnerId: session.learnerId,
      instructorId: session.instructorId,
      status: session.status,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      path: `${envVariables.SESSION_PAGE_PATH}`,
      joinLink: `${envVariables.JOIN_SESSION_PAGE_URL}/${session.id}`,
      timestamp: new Date().toISOString(),
    };
    await this.eventBus.sendEvent(sessionConfirmedEvent);
  }
}
