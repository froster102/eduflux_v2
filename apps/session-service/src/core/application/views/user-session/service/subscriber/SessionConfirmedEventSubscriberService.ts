import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import { UserSession } from '@core/application/views/user-session/entity/UserSession';
import type { SessionConfirmedEventSubscriber } from '@core/application/views/user-session/subscriber/SessionConfirmedEventSubscriber';
import type { UserSessionRepositoryPort } from '@core/application/views/user-session/port/persistence/UserSessionRepositoryPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { SessionConfirmedEvent } from '@eduflux-v2/shared/events/session/SessionConfirmedEvent';
import { inject } from 'inversify';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';
import { SessionConfirmedEvent as SessionConfirmedEventClass } from '@eduflux-v2/shared/events/session/SessionConfirmedEvent';

export class SessionConfirmedEventSubscriberService
  implements SessionConfirmedEventSubscriber
{
  constructor(
    @inject(UserSessionDITokens.UserSessionRepository)
    private readonly userSessionRepository: UserSessionRepositoryPort,
    @inject(SharedCoreDITokens.UserService)
    private readonly userService: UserServicePort,
  ) {}

  async on(event: SessionConfirmedEvent): Promise<void> {
    const { learnerId, instructorId, sessionId, status, endTime, startTime } =
      event.payload;

    const learner = await this.userService.getUser(learnerId);
    const instructor = await this.userService.getUser(instructorId);

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
      status: status,
      createdAt: new Date(),
      updatedAt: new Date(),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    await this.userSessionRepository.save(userSession);

    return;
  }

  subscribedTo() {
    return [SessionConfirmedEventClass];
  }
}

