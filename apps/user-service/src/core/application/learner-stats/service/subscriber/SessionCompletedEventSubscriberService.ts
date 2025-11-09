import { inject } from 'inversify';
import { LearnerStatsDITokens } from '@application/learner-stats/di/LearnerStatsDITokens';
import type { LearnerStatsRepositoryPort } from '@application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import type { SessionCompletedEventSubscriber } from '@application/learner-stats/subscriber/SessionCompletedEventSubscriber';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { InstructorStatsUpdatedEvent } from '@application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import type { MessageBrokerPort } from '@eduflux-v2/shared/src/ports/message/MessageBrokerPort';
import { SessionCompletedEvent } from '@eduflux-v2/shared/events/session/SessionCompletedEvent';

export class SessionCompletedEventSubscriberService
  implements SessionCompletedEventSubscriber
{
  private logger: LoggerPort;
  constructor(
    @inject(LearnerStatsDITokens.LearnerStatsRepository)
    private readonly learnerStatsRepository: LearnerStatsRepositoryPort,
    @inject(SharedCoreDITokens.Logger) logger: LoggerPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(SharedCoreDITokens.MessageBroker)
    private readonly messageBroker: MessageBrokerPort,
  ) {
    this.logger = logger.fromContext(
      SessionCompletedEventSubscriberService.name,
    );
  }

  async on(event: SessionCompletedEvent): Promise<void> {
    const { learnerId, instructorId } = event.payload;

    await this.learnerStatsRepository.incrementCompletedSessions(learnerId);

    const instructor =
      await this.instructorRepository.incrementSessionsConducted(instructorId);

    //send event to update the instructor views
    if (instructor) {
      const instructorStatsUpdatedEvent = new InstructorStatsUpdatedEvent(
        instructorId,
        {
          instructorId,
          sessionsConducted: instructor.getSessionsConducted(),
          totalCourses: instructor.getTotalCourses(),
          totalLearners: instructor.getTotalLearners(),
        },
      );
      await this.messageBroker.publish(instructorStatsUpdatedEvent);
    }
  }

  subscribedTo() {
    return [SessionCompletedEvent];
  }
}
