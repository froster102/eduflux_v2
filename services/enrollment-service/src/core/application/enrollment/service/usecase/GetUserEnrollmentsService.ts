import { EnrollmentDITokens } from '@core/application/enrollment/di/EnrollmentDITokens';
import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import { EnrollmentUseCaseDto } from '@core/application/enrollment/port/usecase/dto/EnrollmentUseCaseDto';
import type { GetUserEnrollmentsPort } from '@core/application/enrollment/port/usecase/GetUserEnrollmentsPort';
import type { GetUserEnrollmentsUseCaseResult } from '@core/application/enrollment/port/usecase/type/GetUserEnrollmentsUseCaseResult';
import type { GetUserEnrollmentsUseCase } from '@core/application/enrollment/usecase/GetUserEnrollmentsUseCase';
import { inject } from 'inversify';

export class GetUserEnrollmentsService implements GetUserEnrollmentsUseCase {
  constructor(
    @inject(EnrollmentDITokens.EnrollmentRepository)
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
  ) {}

  async execute(
    payload: GetUserEnrollmentsPort,
  ): Promise<GetUserEnrollmentsUseCaseResult> {
    const { userId, queryParameters } = payload;

    const result = await this.enrollmentRepository.findUserEnrollments(
      userId,
      queryParameters,
    );

    return {
      totalCount: result.totalCount,
      enrollments: EnrollmentUseCaseDto.fromEntities(result.enrollments),
    };
  }
}
