import { inject } from 'inversify';
import { LearnerStatsDITokens } from '@core/application/learner-stats/di/LearnerStatsDITokens';
import type { LearnerStatsRepositoryPort } from '@core/application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import { InstructorDITokens } from '@core/application/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@core/application/instructor/port/persistence/InstructorRepositoryPort';
import type { SessionCompletedEventHandler } from '@core/application/learner-stats/handler/SessionCompletedEventHandler';
import type { LoggerPort } from '@core/common/port/LoggerPort';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { InstructorStatsUpdatedEvent } from '@core/application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import { InstructorEvents } from '@core/domain/instructor/events/InstructorEvents';
import type { EventBusPort } from '@core/common/message/EventBustPort';
import type { SessionCompletedEvent } from '@core/domain/learner-stats/events/SessionCompletedEvent';

export class SessionCompletedEventHandlerService
  implements SessionCompletedEventHandler
{
  private logger: LoggerPort;
  constructor(
    @inject(LearnerStatsDITokens.LearnerStatsRepository)
    private readonly learnerStatsRepository: LearnerStatsRepositoryPort,
    @inject(CoreDITokens.Logger) logger: LoggerPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
    @inject(CoreDITokens.EventBus) private readonly eventBus: EventBusPort,
  ) {
    this.logger = logger.fromContext(SessionCompletedEventHandlerService.name);
  }

  async handle(event: SessionCompletedEvent): Promise<void> {
    const { learnerId, instructorId } = event;

    await this.learnerStatsRepository.incrementCompletedSessions(learnerId);

    const instructor =
      await this.instructorRepository.incrementSessionsConducted(instructorId);

    if (instructor) {
      const instructorStatsUpdatedEvent: InstructorStatsUpdatedEvent = {
        id: instructorId,
        type: InstructorEvents.INSTRUCTOR_STATS_UPDATED,
        instructorId,
        sessionsConducted: instructor.getSessionsConducted(),
        totalCourses: instructor.getTotalCourses(),
        totalLearners: instructor.getTotalLearners(),
        occuredAt: new Date().toISOString(),
      };
      await this.eventBus.sendEvent(instructorStatsUpdatedEvent);
    }
  }
}
