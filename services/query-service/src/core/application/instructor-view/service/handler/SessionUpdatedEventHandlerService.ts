import { InstructorViewDITokens } from "@core/application/instructor-view/di/InstructorViewDITokens";
import type { SessionUpdatedEvent } from "@core/application/instructor-view/events/SessionUpdatedEvent";
import type { SessionUpdatedEventHandler } from "@core/application/instructor-view/handler/SessionUpdatedEventHandler";
import type { InstructorViewRepositoryPort } from "@core/application/instructor-view/port/persistence/InstructorViewRepositoryPort";
import { SessionStatus } from "@core/domain/user-session/enum/SessionStatus";
import { inject } from "inversify";
export class SessionUpdatedEventHandlerService
  implements SessionUpdatedEventHandler
{
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  async handle(event: SessionUpdatedEvent): Promise<void> {
    if (event.status !== SessionStatus.COMPLETED) {
      return;
    }

    const { instructorId } = event;

    await this.instructorViewRepository.incrementCompletedSessions(
      instructorId,
    );
  }
}
