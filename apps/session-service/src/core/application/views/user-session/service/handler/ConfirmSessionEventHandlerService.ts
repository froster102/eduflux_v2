import type { UserServicePort } from '@core/application/session/port/gateway/UserServicePort';
import { UserSessionDITokens } from '@core/application/views/user-session/di/UserSessionDITokens';
import { UserSession } from '@core/application/views/user-session/entity/UserSession';
import type { ConfirmSessionEventHandler } from '@core/application/views/user-session/handler/ConfirmSessionHandler';
import type { UserSessionRepositoryPort } from '@core/application/views/user-session/port/persistence/UserSessionRepositoryPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { SessionConfimedEvent } from '@core/domain/session/events/SessionConfirmedEvent';
import { inject } from 'inversify';

export class ConfirmSessionEventHandlerService
  implements ConfirmSessionEventHandler
{
  constructor(
    @inject(UserSessionDITokens.UserSessionRepository)
    private readonly userSessionRepository: UserSessionRepositoryPort,
    @inject(CoreDITokens.UserService)
    private readonly userService: UserServicePort,
  ) {}

  async handle(event: SessionConfimedEvent): Promise<void> {
    const { learnerId, instructorId, sessionId, status, endTime, startTime } =
      event;

    const learner = await this.userService.getUserDetails(learnerId);
    const instructor = await this.userService.getUserDetails(instructorId);

    const userSession = UserSession.new({
      ...event,
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
}
