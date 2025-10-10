import type { GetInstructorViewsPort } from '@core/application/views/instructor-view/port/usecase/GetInstructorViewsPort';
import type { GetInstructorViewsResult } from '@core/application/views/instructor-view/usecase/types/GetInstructorViewsResult';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetInstructorViewsUseCase
  extends UseCase<GetInstructorViewsPort, GetInstructorViewsResult> {}
