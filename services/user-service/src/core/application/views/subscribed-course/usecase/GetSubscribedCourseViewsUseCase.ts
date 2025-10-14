import type { SubscribedCourseViewQueryResult } from '@core/application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryResult';
import type { GetSubscribedCoursesPort } from '@core/application/views/subscribed-course/port/usecase/GetSubscribedCoursesPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetSubscribedCourseViewsUseCase
  extends UseCase<GetSubscribedCoursesPort, SubscribedCourseViewQueryResult> {}
