import type { GetEnrollmentPort } from '@core/application/enrollment/port/usecase/GetEnrollmentPort';
import type { UseCase } from '@core/common/usecase/UseCase';
import type { Enrollment } from '@core/domain/enrollment/entity/Enrollment';

export interface GetEnrollmentUseCase
  extends UseCase<GetEnrollmentPort, Enrollment> {}
