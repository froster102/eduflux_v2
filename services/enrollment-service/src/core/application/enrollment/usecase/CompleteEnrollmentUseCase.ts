import type { CompleteEnrollmentPort } from '@core/application/enrollment/port/usecase/CompleteEnrollmentPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface CompleteEnrollmentUseCase
  extends UseCase<CompleteEnrollmentPort, void> {}
