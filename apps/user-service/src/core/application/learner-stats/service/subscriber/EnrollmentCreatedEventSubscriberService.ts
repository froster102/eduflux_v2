import { inject } from 'inversify';
import { LearnerStatsDITokens } from '@application/learner-stats/di/LearnerStatsDITokens';
import type { LearnerStatsRepositoryPort } from '@application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import { SubscribedCourseViewDITokens } from '@application/views/subscribed-course/di/SubscribedCourseViewDITokens';
import type { SubscribedCourseViewRepositoryPort } from '@application/views/subscribed-course/port/SubscribedCourseViewRepositoryPort';
import { SubscribedCourseView } from '@application/views/subscribed-course/entity/SubscribedCourseView';
import type { EnrollmentCreatedEventSubscriber } from '@core/application/learner-stats/subscriber/EnrollmentCreatedEventSubscriber';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { MessageBrokerPort } from '@eduflux-v2/shared/src/ports/message/MessageBrokerPort';
import { InstructorStatsUpdatedEvent } from '@application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import { EnrollmentCreatedEvent } from '@eduflux-v2/shared/events/course/EnrollmentCreatedEvent';
import { ProgressDITokens } from '@core/application/progress/di/ProgressDITokens';
import type { CreateProgressUseCase } from '@core/application/progress/usecase/CreateProgressUseCase';

export class EnrollmentCreatedEventSubscriberService
  implements EnrollmentCreatedEventSubscriber
{
  constructor(
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
    @inject(LearnerStatsDITokens.LearnerStatsRepository)
    private readonly learnerStatsRepository: LearnerStatsRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(SubscribedCourseViewDITokens.SubscribedCourseViewRepository)
    private readonly subscribedCourseViewRepository: SubscribedCourseViewRepositoryPort,
    @inject(ProgressDITokens.CreateProgressUseCase)
    private readonly createProgressUseCase: CreateProgressUseCase,
  ) {}

  async on(event: EnrollmentCreatedEvent): Promise<void> {
    const {
      userId,
      instructorId,
      courseId,
      title,
      description,
      thumbnail,
      instructor,
      level,
      averageRating,
    } = event.payload;

    //perform transaction
    await this.learnerStatsRepository.adjustEnrolledCourses(userId, 1);

    const updatedInstructor =
      await this.instructorRepository.incrementTotalLearners(instructorId);

    const subscribeCourseView = SubscribedCourseView.new({
      id: courseId,
      userId,
      title,
      description,
      thumbnail,
      instructor,
      level,
      averageRating,
      enrollmentCount: 0, // EnrollmentCompletedEvent doesn't include enrollmentCount, use default
    });

    //Create progress for the enrollment user
    await this.createProgressUseCase.execute({ courseId, userId });

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

    await this.subscribedCourseViewRepository.save(subscribeCourseView);
  }

  subscribedTo() {
    return [EnrollmentCreatedEvent];
  }
}
