import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import type { CheckUserEnrollmentPort } from '@core/application/enrollment/port/usecase/CheckUserEnrollmentPort';
import type { CheckUserEnrollmentUseCaseResult } from '@core/application/enrollment/port/usecase/type/CheckUserEnrollmentUseCaseResult';
import type { CheckUserEnrollmentUseCase } from '@core/application/enrollment/usecase/CheckUserEnrollmentUseCase';
import { EnrollmentStatus } from '@core/common/enums/EnrollmentStatus';
import { inject } from 'inversify';

export class CheckUserEnrollmentService implements CheckUserEnrollmentUseCase {
  constructor(
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
  ) {}

  async execute(
    payload: CheckUserEnrollmentPort,
  ): Promise<CheckUserEnrollmentUseCaseResult> {
    const { userId, courseId } = payload;
    const enrollment =
      await this.enrollmentRepository.findUserEnrollmentForCourse(
        userId,
        courseId,
      );

    if (!enrollment) {
      return { isEnrolled: false };
    }

    if (enrollment.status === EnrollmentStatus.COMPLETED) {
      return { isEnrolled: true };
    }

    return { isEnrolled: false };
  }
}
