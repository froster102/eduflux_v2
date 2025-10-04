import { inject } from 'inversify';
import type { SessionUpdatedEventHandler } from '@core/domain/learner-stats/handler/SessionUpdatedEventHandler';
import { LearnerStatsDITokens } from '@core/domain/learner-stats/di/LearnerStatsDITokens';
import type { LearnerStatsRepositoryPort } from '@core/domain/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import type { SessionUpdatedEvent } from '@core/domain/learner-stats/events/SessionUpdatedEvent';
import { SessionStatus } from '@core/common/enums/SessionStatus';
import { InstructorDITokens } from '@core/domain/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@core/domain/instructor/port/persistence/InstructorRepositoryPort';

export class SessionUpdatedEventHandlerService
  implements SessionUpdatedEventHandler
{
  constructor(
    @inject(LearnerStatsDITokens.LearnerStatsRepository)
    private readonly learnerStatsRepository: LearnerStatsRepositoryPort,

    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
  ) {}

  async handle(event: SessionUpdatedEvent): Promise<void> {
    if (event.status !== SessionStatus.COMPLETED) {
      return;
    }

    const { learnerId, instructorId } = event;

    await this.learnerStatsRepository.incrementCompletedSessions(learnerId);

    await this.instructorRepository.incrementSessionsConducted(instructorId);
  }
}
