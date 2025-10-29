import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import { EnrollmentNotFoundException } from '@core/application/enrollment/exception/EnrollmentNotFoundException';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import type { GetEnrollmentPort } from '@core/application/enrollment/port/usecase/GetEnrollmentPort';
import type { GetEnrollmentUseCase } from '@core/application/enrollment/usecase/GetEnrollmentUseCase';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
import type { Enrollment } from '@core/domain/enrollment/entity/Enrollment';
import { inject } from 'inversify';

export class GetEnrollmentService implements GetEnrollmentUseCase {
  constructor(
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
  ) {}

  async execute(payload: GetEnrollmentPort): Promise<Enrollment> {
    const enrollment = CoreAssert.notEmpty(
      await this.enrollmentRepository.findById(payload.enrollmentId),
      new EnrollmentNotFoundException(payload.enrollmentId),
    );

    return enrollment;
  }
}
