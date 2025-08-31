import type { GetUserEnrollmentsPorts } from '@core/application/enrollment/port/usecase/GetUserEnrollmentsPort';
import type { GetUserEnrollmentsUseCaseResult } from '@core/application/enrollment/port/usecase/type/GetUserEnrollmentsUseCaseResult';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetUserEnrollmentsUseCase
  extends UseCase<GetUserEnrollmentsPorts, GetUserEnrollmentsUseCaseResult> {}
