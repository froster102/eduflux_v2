import { InstructorViewDITokens } from '@application/views/instructor-view/di/InstructorViewDITokens';
import { InstructorStatsUpdatedEvent } from '@application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import type { InstructorStatsUpdatedEventSubscriber } from '@application/views/instructor-view/subscriber/InstructorStatsUpdatedEventSubscriber';
import type { InstructorViewRepositoryPort } from '@application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import { inject } from 'inversify';

export class InstructorStatsUpdatedEventSubscriberService
  implements InstructorStatsUpdatedEventSubscriber
{
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  async on(event: InstructorStatsUpdatedEvent): Promise<void> {
    const { instructorId, sessionsConducted, totalCourses, totalLearners } =
      event.payload;

    const updatePayload = {
      sessionsConducted,
      totalCourses,
      totalLearners,
    };

    await this.instructorViewRepository.upsert(instructorId, updatePayload);
  }

  subscribedTo() {
    return [InstructorStatsUpdatedEvent];
  }
}

