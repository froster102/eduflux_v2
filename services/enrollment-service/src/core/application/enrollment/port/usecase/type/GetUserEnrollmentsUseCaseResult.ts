import type { EnrollmentUseCaseDto } from '@core/application/enrollment/port/usecase/dto/EnrollmentUseCaseDto';

export type GetUserEnrollmentsUseCaseResult = {
  totalCount: number;
  enrollments: EnrollmentUseCaseDto[];
};
