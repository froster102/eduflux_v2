import type { TaughtCourseViewQueryResult } from '@core/application/views/taught-course/port/persistence/types/TaughtCourseViewQueryResult';
import type { GetTaughtCourseViewsPort } from '@core/application/views/taught-course/port/persistence/usecase/GetTaughtCourseViewsPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetTaughtCourseViewsUseCase
  extends UseCase<GetTaughtCourseViewsPort, TaughtCourseViewQueryResult> {}
