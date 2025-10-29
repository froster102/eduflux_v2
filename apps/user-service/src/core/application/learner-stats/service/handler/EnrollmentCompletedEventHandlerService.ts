import { inject } from 'inversify';
import { LearnerStatsDITokens } from '@application/learner-stats/di/LearnerStatsDITokens';
import type { LearnerStatsRepositoryPort } from '@application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import { SubscribedCourseViewDITokens } from '@application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { SubscribedCourseViewRepositoryPort } from '@application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import { SubscribedCourseView } from '@application/views/subscribed-course/entity/SubscribedCourseView';
import type { EnrollmentCompletedEventHandler } from '@application/learner-stats/handler/EnrollmentCompletedEventHandler';
import type { EnrollmentCompletedEvent } from '@eduflux-v2/shared/events/course/EnrollmentCompletedEvent';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { EventBusPort } from '@eduflux-v2/shared/ports/message/EventBusPort';
import type { InstructorStatsUpdatedEvent } from '@application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import { InstructorEvents } from '@domain/instructor/events/InstructorEvents';

export class EnrollmentCompletedEventHandlerService
  implements EnrollmentCompletedEventHandler
{
  constructor(
    @inject(CoreDITokens.EventBus) private readonly eventBus: EventBusPort,
    @inject(LearnerStatsDITokens.LearnerStatsRepository)
    private readonly learnerStatsRepository: LearnerStatsRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(SubscribedCourseViewDITokens.SubscribedCourseViewRepository)
    private readonly subscribedCourseViewRepository: SubscribedCourseViewRepositoryPort,
  ) {}

  async handle(event: EnrollmentCompletedEvent): Promise<void> {
    const { userId, instructorId, courseId, courseMetadata } = event;

    //perform transaction
    await this.learnerStatsRepository.adjustEnrolledCourses(userId, 1);

    const updatedInstructor =
      await this.instructorRepository.incrementTotalLearners(instructorId);

    const subscribeCourseView = SubscribedCourseView.new({
      ...courseMetadata,
      id: courseId,
      userId,
    });

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

    await this.subscribedCourseViewRepository.save(subscribeCourseView);
  }
}
