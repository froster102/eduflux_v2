import { UserSessionDITokens } from "@core/application/user-session/di/UserSessionDITokens";
import type { ConfirmSessionEventHandler } from "@core/application/user-session/handler/ConfirmSessionHandler";
import type { UserSessionRepositoryPort } from "@core/application/user-session/port/persistence/UserSessionRepositoryPort";
import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { UserServicePort } from "@core/common/port/gateway/UserServicePort";
import { UserSession } from "@core/domain/user-session/entity/UserSession";
import type { SessionConfimedEvent } from "@core/domain/user-session/events/ConfirmSessionEvent";
import { inject } from "inversify";

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
    const learner = await this.userService.getUser(learnerId);
    const instructor = await this.userService.getUser(instructorId);

    const userSession = UserSession.new({
      ...event,
      learner: {
        ...learner,
        name: learner.firstName + " " + learner.lastName,
      },
      instructor: {
        ...instructor,
        name: instructor.firstName + " " + instructor.lastName,
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
