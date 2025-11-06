import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import { UserSession } from '@core/application/views/user-session/entity/UserSession';
import type { UserSessionRepositoryPort } from '@core/application/views/user-session/port/persistence/UserSessionRepositoryPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { SessionConfirmedEvent } from '@eduflux-v2/shared/events/session/SessionConfirmedEvent';
import { inject } from 'inversify';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { envVariables } from '@shared/env/envVariables';
import { SessionBookingConfirmEvent } from '@eduflux-v2/shared/events/session/SessionBookingConfirmEvent';
import type { SessionBookingConfirmEventSubscriber } from '@core/application/views/user-session/subscriber/SessionBookingConfirmEventSubscriber';
import { SessionDITokens } from '@core/application/session/di/SessionDITokens';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';

export class SessionBookingConfirmEventSubscriberService
  implements SessionBookingConfirmEventSubscriber
{
  constructor(
    @inject(UserSessionDITokens.UserSessionRepository)
    private readonly userSessionRepository: UserSessionRepositoryPort,
    @inject(SessionDITokens.SessionRepository)
    private readonly sessionRepository: SessionRepositoryPort,
    @inject(SharedCoreDITokens.UserService)
    private readonly userService: UserServicePort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}

  async on(event: SessionBookingConfirmEvent): Promise<void> {
    const { learnerId, instructorId, sessionId, paymentId } = event.payload;

    const learner = await this.userService.getUser(learnerId);
    const instructor = await this.userService.getUser(instructorId);

    const bookedSession = CoreAssert.notEmpty(
      await this.sessionRepository.findById(sessionId),
      new NotFoundException('Session not found'),
    );

    bookedSession.markAsConfirmed(paymentId);
    await this.sessionRepository.update(bookedSession.id, bookedSession);

    const userSession = UserSession.new({
      ...event.payload,
      learner: {
        ...learner,
        name: learner.firstName + ' ' + learner.lastName,
      },
      instructor: {
        ...instructor,
        name: instructor.firstName + ' ' + instructor.lastName,
      },
      id: sessionId,
      status: bookedSession.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      startTime: new Date(bookedSession.startTime),
      endTime: new Date(bookedSession.endTime),
    });

    await this.userSessionRepository.upsert(userSession);

    const sessionConfirmedEvent = new SessionConfirmedEvent(userSession.id, {
      sessionId: userSession.id,
      learnerId,
      instructorId,
      status: bookedSession.status,
      startTime: bookedSession.startTime.toISOString(),
      endTime: bookedSession.endTime.toISOString(),
      path: `${envVariables.SESSION_PAGE_PATH}`,
      joinLink: `${envVariables.JOIN_SESSION_PAGE_URL}/${userSession.id}`,
    });
    await this.messageBroker.publish(sessionConfirmedEvent);

    return;
  }

  subscribedTo() {
    return [SessionBookingConfirmEvent];
  }
}
