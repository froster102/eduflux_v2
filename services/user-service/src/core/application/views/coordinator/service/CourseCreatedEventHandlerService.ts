import type { CourseCreatedEvent } from '@core/application/views/coordinator/events/CourseCreatedEvent';
import { TaughtCourseViewDITokens } from '@core/application/views/taught-course/di/TaughtCourseViewDITokens';
import type { TaughtCourseViewRepositoryPort } from '@core/application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import type { EventHandler } from '@core/common/events/EventHandler';
import { inject } from 'inversify';

export class CourseCreatedEventHandlerService
  implements EventHandler<CourseCreatedEvent, void>
{
  constructor(
    @inject(TaughtCourseViewDITokens.TaughtCourseViewRepository)
    private readonly taughtCourseViewRepository: TaughtCourseViewRepositoryPort,
  ) {}

  async handle(event: CourseCreatedEvent): Promise<void> {
    await this.taughtCourseViewRepository.upsert({
      ...event.courseMetadata,
      instructorId: event.instructorId,
    });
  }
}
