import type { TaughtCourseViewQueryResult } from '@application/views/taught-course/port/persistence/types/TaughtCourseViewQueryResult';
import type { GetTaughtCourseViewsPort } from '@application/views/taught-course/port/persistence/usecase/GetTaughtCourseViewsPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetTaughtCourseViewsUseCase
  extends UseCase<GetTaughtCourseViewsPort, TaughtCourseViewQueryResult> {}
