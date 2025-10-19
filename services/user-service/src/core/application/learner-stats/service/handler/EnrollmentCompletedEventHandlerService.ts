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

export class EnrollmentCompletedEventHandlerService
  implements EnrollmentCompletedEventHandler
{
  constructor(
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

    await this.instructorRepository.incrementTotalLearners(instructorId);

    const subscribeCourseView = SubscribedCourseView.new({
      ...courseMetadata,
      id: courseId,
      userId,
    });
    await this.subscribedCourseViewRepository.save(subscribeCourseView);
  }
}
