import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import type { CoursePublishedEvent } from '@application/views/coordinator/events/CoursePublishedEvent';
import type { CoursePublishedEventHandler } from '@application/views/coordinator/handler/CoursePublishedEventHandler';
import type { InstructorStatsUpdatedEvent } from '@application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import { TaughtCourseViewDITokens } from '@application/views/taught-course/di/TaughtCourseViewDITokens';
import type { TaughtCourseViewRepositoryPort } from '@application/views/taught-course/port/persistence/TaughtCourseViewRepositoryPort';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { EventBusPort } from '@eduflux-v2/shared/ports/message/EventBusPort';
import { InstructorEvents } from '@domain/instructor/events/InstructorEvents';
import { inject } from 'inversify';

export class CoursePublishedEventHandlerService
  implements CoursePublishedEventHandler
{
  constructor(
    @inject(TaughtCourseViewDITokens.TaughtCourseViewRepository)
    private readonly taughtCourseViewRepository: TaughtCourseViewRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(CoreDITokens.EventBus) private readonly eventBus: EventBusPort,
  ) {}

  async handle(event: CoursePublishedEvent): Promise<void> {
    const updatedInstructor =
      await this.instructorRepository.incrementCourseCreated(
        event.instructorId,
      );

    //send event to update the instructor views
    if (updatedInstructor) {
      const instructorStatsUpdatedEvent: InstructorStatsUpdatedEvent = {
        id: updatedInstructor.id,
        type: InstructorEvents.INSTRUCTOR_STATS_UPDATED,
        instructorId: updatedInstructor.id,
        sessionsConducted: updatedInstructor.getSessionsConducted(),
        totalCourses: updatedInstructor.getTotalCourses(),
        totalLearners: updatedInstructor.getTotalLearners(),
        timestamp: new Date().toISOString(),
      };
      await this.eventBus.sendEvent(instructorStatsUpdatedEvent);
    }
  }
}
