import type { CreateEnrollmentPort } from '@core/application/enrollment/port/usecase/CreateEnrollmentPort';
import type { CreateEnrollmentUseCaseResult } from '@core/application/enrollment/port/usecase/type/CreateEnrollmentUseCaseResult';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface CreateEnrollmentUseCase
  extends UseCase<CreateEnrollmentPort, CreateEnrollmentUseCaseResult> {}
