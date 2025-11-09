import { InstructorViewDITokens } from '@application/views/instructor-view/di/InstructorViewDITokens';
import { InstructorView } from '@application/views/instructor-view/entity/InstructorView';
import type { InstructorCreatedEventSubscriber } from '@application/views/instructor-view/subscriber/InstructorCreatedEventSubscriber';
import type { InstructorViewRepositoryPort } from '@application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import { InstructorCreatedEvent } from '@application/views/instructor-view/events/InstructorCreatedEvent';
import { inject } from 'inversify';

export class InstructorCreatedEventSubscriberService
  implements InstructorCreatedEventSubscriber
{
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  public async on(event: InstructorCreatedEvent): Promise<void> {
    const { profile, sessionsConducted, totalCourses, totalLearners } =
      event.payload;
    const id = event.id;

    const instructor = InstructorView.new({
      id,
      profile,
      sessionsConducted,
      totalCourses,
      totalLearners,
    });

    await this.instructorViewRepository.upsert(id, instructor);
  }

  subscribedTo() {
    return [InstructorCreatedEvent];
  }
}
