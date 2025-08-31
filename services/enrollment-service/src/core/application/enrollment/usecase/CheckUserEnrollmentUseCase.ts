import type { CheckUserEnrollmentPort } from '@core/application/enrollment/port/usecase/CheckUserEnrollmentPort';
import type { CheckUserEnrollmentUseCaseResult } from '@core/application/enrollment/port/usecase/type/CheckUserEnrollmentUseCaseResult';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface CheckUserEnrollmentUseCase
  extends UseCase<CheckUserEnrollmentPort, CheckUserEnrollmentUseCaseResult> {}
