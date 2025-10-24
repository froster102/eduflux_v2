import { InstructorViewDITokens } from '@core/application/views/instructor-view/di/InstructorViewDITokens';
import { InstructorView } from '@core/application/views/instructor-view/entity/InstructorView';
import type { InstructorCreatedEventHandler } from '@core/application/views/instructor-view/handler/InstructorCreatedEventHandler';
import type { InstructorViewRepositoryPort } from '@core/application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import type { InstructorCreatedEvent } from '@core/domain/user/events/InstructorCreatedEvent';
import { inject } from 'inversify';

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
