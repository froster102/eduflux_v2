import { inject } from 'inversify';
import { LearnerStatsDITokens } from '@application/learner-stats/di/LearnerStatsDITokens';
import type { LearnerStatsRepositoryPort } from '@application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import { InstructorDITokens } from '@application/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import type { SessionCompletedEventHandler } from '@application/learner-stats/handler/SessionCompletedEventHandler';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { InstructorStatsUpdatedEvent } from '@application/views/instructor-view/events/InstructorStatsUpdatedEvent';
import { InstructorEvents } from '@domain/instructor/events/InstructorEvents';
import type { EventBusPort } from '@eduflux-v2/shared/ports/message/EventBusPort';
import type { SessionCompletedEvent } from '@eduflux-v2/shared/events/session/SessionCompletedEvent';

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

    //send event to update the instructor views
    if (instructor) {
      const instructorStatsUpdatedEvent: InstructorStatsUpdatedEvent = {
        id: instructorId,
        type: InstructorEvents.INSTRUCTOR_STATS_UPDATED,
        instructorId,
        sessionsConducted: instructor.getSessionsConducted(),
        totalCourses: instructor.getTotalCourses(),
        totalLearners: instructor.getTotalLearners(),
        timestamp: new Date().toISOString(),
      };
      await this.eventBus.sendEvent(instructorStatsUpdatedEvent);
    }
  }
}
