import { inject } from 'inversify';
import type { EnrollmentSuccessEventHandler } from '@core/domain/learner-stats/handler/EnrollmentSuccessEventHandler';
import { LearnerStatsDITokens } from '@core/domain/learner-stats/di/LearnerStatsDITokens';
import type { LearnerStatsRepositoryPort } from '@core/domain/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import type { EnrollmentSuccessEvent } from '@core/domain/learner-stats/events/EnrollmentSuccessEvent';
import { InstructorDITokens } from '@core/domain/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@core/domain/instructor/port/persistence/InstructorRepositoryPort';

export class EnrollmentSuccessEventHandlerService
  implements EnrollmentSuccessEventHandler
{
  constructor(
    @inject(LearnerStatsDITokens.LearnerStatsRepository)
    private readonly learnerStatsRepository: LearnerStatsRepositoryPort,
    @inject(InstructorDITokens.InstructorRepository)
    private readonly instructorRepository: InstructorRepositoryPort,
  ) {}

  async handle(event: EnrollmentSuccessEvent): Promise<void> {
    const { userId, instructorId } = event;

    await this.learnerStatsRepository.adjustEnrolledCourses(userId, 1);

    await this.instructorRepository.incrementTotalLearners(instructorId);
  }
}
