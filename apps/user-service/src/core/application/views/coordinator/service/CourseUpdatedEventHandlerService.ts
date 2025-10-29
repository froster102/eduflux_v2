import type { CourseUpdatedEvent } from '@application/views/coordinator/events/CourseUpdatedEvent';
import type { CourseUpdatedEventHandler } from '@application/views/coordinator/handler/CourseUpdateEventHandler';
import { SubscribedCourseViewDITokens } from '@application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { SubscribedCourseViewRepositoryPort } from '@application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import { TaughtCourseViewDITokens } from '@application/views/taught-course/di/TaughtCourseViewDITokens';
import type { TaughtCourseViewRepositoryPort } from '@application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import { inject } from 'inversify';

export class CourseUpdatedEventHandlerService
  implements CourseUpdatedEventHandler
{
  constructor(
    @inject(TaughtCourseViewDITokens.TaughtCourseViewRepository)
    private readonly taughtCourseViewRepository: TaughtCourseViewRepositoryPort,
    @inject(SubscribedCourseViewDITokens.SubscribedCourseViewRepository)
    private readonly subscribedCourseViewRepository: SubscribedCourseViewRepositoryPort,
  ) {}

  async handle(event: CourseUpdatedEvent): Promise<void> {
    //perform transaction
    await this.taughtCourseViewRepository.upsert({
      ...event.courseMetadata,
      instructorId: event.instructorId,
    });
    await this.subscribedCourseViewRepository.upsert(event.courseMetadata);
  }
}
