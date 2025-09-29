import { InstructorViewDITokens } from "@core/application/instructor-view/di/InstructorViewDITokens";
import type { InstructorCreatedEvent } from "@core/application/instructor-view/events/InstructorCreatedEvent";
import type { InstructorCreatedEventHandler } from "@core/application/instructor-view/handler/InstructorCreatedEventHandler";
import type { InstructorViewRepositoryPort } from "@core/application/instructor-view/port/persistence/InstructorViewRepositoryPort";
import { InstructorView } from "@core/domain/instructor-view/entity/InstructorView";
import { inject } from "inversify";

export class InstructorCreatedEventHandlerService
  implements InstructorCreatedEventHandler
{
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  public async handle(event: InstructorCreatedEvent): Promise<void> {
    const { id, profile, sessionsConducted, totalCourses, totalLearners } =
      event;

    const instructor = InstructorView.new({
      id,
      profile,
      sessionsConducted,
      totalCourses,
      totalLearners,
    });

    await this.instructorViewRepository.upsert(id, instructor);
  }
}
