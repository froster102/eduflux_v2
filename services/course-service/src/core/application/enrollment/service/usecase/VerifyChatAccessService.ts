import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import type { VerifyChatAccessUseCaseResult } from '@core/application/enrollment/port/usecase/type/VerifyChatAccessUseCaseResult';
import type { VerifyChatAccessPort } from '@core/application/enrollment/port/usecase/VerifyChatAccessPort';
import type { VerifyChatAccessUseCase } from '@core/application/enrollment/usecase/VerifyChatAccessUseCase';
import { inject } from 'inversify';

export class VerifyChatAccessService implements VerifyChatAccessUseCase {
  constructor(
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
  ) {}

  async execute(
    payload: VerifyChatAccessPort,
  ): Promise<VerifyChatAccessUseCaseResult> {
    const { learnerId, instructorId } = payload;
    const learnerEnrollments =
      await this.enrollmentRepository.findEnrollmentWithLearnerAndInstructorId(
        learnerId,
        instructorId,
      );
    if (learnerEnrollments) {
      return { hasAccess: true };
    }
    return { hasAccess: false };
  }
}
