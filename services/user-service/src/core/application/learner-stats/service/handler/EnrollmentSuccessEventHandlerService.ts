import { inject } from 'inversify';
import type { EnrollmentSuccessEventHandler } from '@core/application/learner-stats/handler/EnrollmentSuccessEventHandler';
import { LearnerStatsDITokens } from '@core/application/learner-stats/di/LearnerStatsDITokens';
import type { LearnerStatsRepositoryPort } from '@core/application/learner-stats/port/persistence/LearnerStatsRepositoryPort';
import type { EnrollmentSuccessEvent } from '@core/domain/learner-stats/events/EnrollmentSuccessEvent';
import { InstructorDITokens } from '@core/application/instructor/di/InstructorDITokens';
import type { InstructorRepositoryPort } from '@core/application/instructor/port/persistence/InstructorRepositoryPort';

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
