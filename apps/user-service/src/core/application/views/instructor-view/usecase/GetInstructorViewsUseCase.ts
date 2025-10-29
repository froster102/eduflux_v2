import type { GetInstructorViewsPort } from '@application/views/instructor-view/port/usecase/GetInstructorViewsPort';
import type { GetInstructorViewsResult } from '@application/views/instructor-view/usecase/types/GetInstructorViewsResult';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetInstructorViewsUseCase
  extends UseCase<GetInstructorViewsPort, GetInstructorViewsResult> {}
