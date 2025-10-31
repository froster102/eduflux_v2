import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import { CoursePublishedEvent } from '@eduflux-v2/shared/events/course/CoursePublishedEvent';
import type { CoursePublishedEventSubscriber } from '@application/views/coordinator/subscriber/CoursePublishedEventSubscriber';
import { InstructorStatsUpdatedEvent } from '@application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import { TaughtCourseViewDITokens } from '@application/views/taught-course/di/TaughtCourseViewDITokens';
import type { TaughtCourseViewRepositoryPort } from '@application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { MessageBrokerPort } from '@eduflux-v2/shared/src/ports/message/MessageBrokerPort';
import { inject } from 'inversify';

export class CoursePublishedEventSubscriberService
  implements CoursePublishedEventSubscriber
{
  constructor(
    @inject(TaughtCourseViewDITokens.TaughtCourseViewRepository)
    private readonly taughtCourseViewRepository: TaughtCourseViewRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}

  async on(event: CoursePublishedEvent): Promise<void> {
    const updatedInstructor =
      await this.instructorRepository.incrementCourseCreated(
        event.payload.instructorId,
      );

    //send event to update the instructor views
    if (updatedInstructor) {
      const instructorStatsUpdatedEvent = new InstructorStatsUpdatedEvent(
        updatedInstructor.id,
        {
          instructorId: updatedInstructor.id,
          sessionsConducted: updatedInstructor.getSessionsConducted(),
          totalCourses: updatedInstructor.getTotalCourses(),
          totalLearners: updatedInstructor.getTotalLearners(),
        },
      );
      await this.messageBroker.publish(instructorStatsUpdatedEvent);
    }
  }

  subscribedTo() {
    return [CoursePublishedEvent];
  }
}
