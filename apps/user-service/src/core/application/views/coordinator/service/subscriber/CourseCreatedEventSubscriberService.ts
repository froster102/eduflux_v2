import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import { CourseCreatedEvent } from '@eduflux-v2/shared/events/course/CourseCreatedEvent';
import { InstructorStatsUpdatedEvent } from '@application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import { TaughtCourseViewDITokens } from '@application/views/taught-course/di/TaughtCourseViewDITokens';
import type { TaughtCourseViewRepositoryPort } from '@application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { MessageBrokerPort } from '@eduflux-v2/shared/src/ports/message/MessageBrokerPort';
import { inject } from 'inversify';
import type { CourseCreatedEventSubscriber } from '@application/views/coordinator/subscriber/CourseCreatedEventSubscriber';

export class CourseCreatedEventSubscriberService
  implements CourseCreatedEventSubscriber
{
  constructor(
    @inject(TaughtCourseViewDITokens.TaughtCourseViewRepository)
    private readonly taughtCourseViewRepository: TaughtCourseViewRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {}

  async on(event: CourseCreatedEvent): Promise<void> {
    await this.taughtCourseViewRepository.upsert({
      id: event.payload.id,
      title: event.payload.title,
      thumbnail: event.payload.thumbnail,
      level: event.payload.level,
      enrollmentCount: event.payload.enrollmentCount,
      averageRating: event.payload.averageRating,
      instructorId: event.payload.instructorId,
    });

    const updatedInstructor =
      await this.instructorRepository.incrementTotalLearners(
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
    return [CourseCreatedEvent];
  }
}
