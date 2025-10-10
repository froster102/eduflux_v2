import { InstructorViewDITokens } from '@core/application/views/instructor-view/di/InstructorViewDITokens';
import type { InstructorStatsUpdatedEvent } from '@core/application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import type { InstructorStatsUpdatedEventHandler } from '@core/application/views/instructor-view/handler/InstructorStatsUpdatedEventHandler';
import type { InstructorViewRepositoryPort } from '@core/application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import { inject } from 'inversify';

export class InstructorStatsUpdatedEventHandlerService
  implements InstructorStatsUpdatedEventHandler
{
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  async handle(event: InstructorStatsUpdatedEvent): Promise<void> {
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
