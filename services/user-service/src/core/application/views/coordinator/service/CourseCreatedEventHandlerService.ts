import { InstructorDITokens } from '@core/application/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@core/application/instructor/port/persistence/InstructorRepositoryPort';
import type { CourseCreatedEvent } from '@core/application/views/coordinator/events/CourseCreatedEvent';
import type { InstructorStatsUpdatedEvent } from '@core/application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import { TaughtCourseViewDITokens } from '@core/application/views/taught-course/di/TaughtCourseViewDITokens';
import type { TaughtCourseViewRepositoryPort } from '@core/application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { EventHandler } from '@core/common/events/EventHandler';
import type { EventBusPort } from '@core/common/message/EventBustPort';
import { InstructorEvents } from '@core/domain/instructor/events/InstructorEvents';
import { inject } from 'inversify';

export class CourseCreatedEventHandlerService
  implements EventHandler<CourseCreatedEvent, void>
{
  constructor(
    @inject(TaughtCourseViewDITokens.TaughtCourseViewRepository)
    private readonly taughtCourseViewRepository: TaughtCourseViewRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(CoreDITokens.EventBus) private readonly eventBus: EventBusPort,
  ) {}

  async handle(event: CourseCreatedEvent): Promise<void> {
    await this.taughtCourseViewRepository.upsert({
      ...event.courseMetadata,
      instructorId: event.instructorId,
    });

    const updatedInstructor =
      await this.instructorRepository.incrementTotalLearners(
        event.instructorId,
      );

    //send event to update the instructor views
    if (updatedInstructor) {
      const instructorStatsUpdatedEvent: InstructorStatsUpdatedEvent = {
        id: updatedInstructor.getId(),
        type: InstructorEvents.INSTRUCTOR_STATS_UPDATED,
        instructorId: updatedInstructor.getId(),
        sessionsConducted: updatedInstructor.getSessionsConducted(),
        totalCourses: updatedInstructor.getTotalCourses(),
        totalLearners: updatedInstructor.getTotalLearners(),
        occuredAt: new Date().toISOString(),
      };
      await this.eventBus.sendEvent(instructorStatsUpdatedEvent);
    }
  }
}
