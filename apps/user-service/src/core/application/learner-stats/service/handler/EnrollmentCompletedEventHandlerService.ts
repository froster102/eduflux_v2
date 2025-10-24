import { inject } from 'inversify';
import { LearnerStatsDITokens } from '@core/application/learner-stats/di/LearnerStatsDITokens';
import type { LearnerStatsRepositoryPort } from '@core/application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import { InstructorDITokens } from '@core/application/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@core/application/instructor/port/persistence/InstructorRepositoryPort';
import { SubscribedCourseViewDITokens } from '@core/application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { SubscribedCourseViewRepositoryPort } from '@core/application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import { SubscribedCourseView } from '@core/application/views/subscribed-course/entity/SubscribedCourseView';
import type { EnrollmentCompletedEventHandler } from '@core/application/learner-stats/handler/EnrollmentCompletedEventHandler';
import type { EnrollmentCompletedEvent } from '@core/domain/learner-stats/events/EnrollmentCompletedEvent';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { EventBusPort } from '@core/common/message/EventBustPort';
import type { InstructorStatsUpdatedEvent } from '@core/application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import { InstructorEvents } from '@core/domain/instructor/events/InstructorEvents';

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

    await this.subscribedCourseViewRepository.save(subscribeCourseView);
  }
}
