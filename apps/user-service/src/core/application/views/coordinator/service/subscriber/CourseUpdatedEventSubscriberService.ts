import { CourseUpdatedEvent } from '@eduflux-v2/shared/events/course/CourseUpdatedEvent';
import type { CourseUpdatedEventSubscriber } from '@application/views/coordinator/subscriber/CourseUpdatedEventSubscriber';
import { SubscribedCourseViewDITokens } from '@application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { SubscribedCourseViewRepositoryPort } from '@application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import { TaughtCourseViewDITokens } from '@application/views/taught-course/di/TaughtCourseViewDITokens';
import type { TaughtCourseViewRepositoryPort } from '@application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import { inject } from 'inversify';

export class CourseUpdatedEventSubscriberService
  implements CourseUpdatedEventSubscriber
{
  constructor(
    @inject(TaughtCourseViewDITokens.TaughtCourseViewRepository)
    private readonly taughtCourseViewRepository: TaughtCourseViewRepositoryPort,
    @inject(SubscribedCourseViewDITokens.SubscribedCourseViewRepository)
    private readonly subscribedCourseViewRepository: SubscribedCourseViewRepositoryPort,
  ) {}

  async on(event: CourseUpdatedEvent): Promise<void> {
    //perform transaction
    await this.taughtCourseViewRepository.upsert({
      id: event.payload.courseId,
      title: event.payload.title,
      thumbnail: event.payload.thumbnail,
      description: event.payload.description,
      level: event.payload.level,
      enrollmentCount: event.payload.enrollmentCount,
      averageRating: event.payload.averageRating,
      instructorId: event.payload.instructorId,
    });
    await this.subscribedCourseViewRepository.upsert({
      id: event.payload.courseId,
      title: event.payload.title,
      thumbnail: event.payload.thumbnail,
      description: event.payload.description,
      level: event.payload.level,
      enrollmentCount: event.payload.enrollmentCount,
      averageRating: event.payload.averageRating,
    });
  }

  subscribedTo() {
    return [CourseUpdatedEvent];
  }
}
