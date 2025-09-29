import { InstructorViewDITokens } from "@core/application/instructor-view/di/InstructorViewDITokens";
import type { InstructorStatsEvent } from "@core/application/instructor-view/events/InstructorStatsEvent";
import type { InstructorStatsEventHandler } from "@core/application/instructor-view/handler/InstructorStatsEventHandler";
import type { InstructorViewRepositoryPort } from "@core/application/instructor-view/port/persistence/InstructorViewRepositoryPort";
import { inject } from "inversify";

export class InstructorStatsEventHandlerService
  implements InstructorStatsEventHandler
{
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  async handle(event: InstructorStatsEvent): Promise<void> {
    const { instructorId, sessionsConducted, totalCourses, totalLearners } =
      event;

    const updatePayload = {
      sessionsConducted,
      totalCourses,
      totalLearners,
    };

    await this.instructorViewRepository.upsert(instructorId, updatePayload);
  }
}
