import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { GetCoursePort } from '@core/application/course/port/usecase/GetCoursePort';
import type { GetCourseUseCaseResult } from '@core/application/course/usecase/types/GetCourseUseCaseResult';

export interface GetCourseUseCase
  extends UseCase<GetCoursePort, GetCourseUseCaseResult> {}
