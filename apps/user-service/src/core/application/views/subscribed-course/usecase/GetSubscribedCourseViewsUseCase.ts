import type { SubscribedCourseViewQueryResult } from '@application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryResult';
import type { GetSubscribedCoursesPort } from '@application/views/subscribed-course/port/usecase/GetSubscribedCoursesPort';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetSubscribedCourseViewsUseCase
  extends UseCase<GetSubscribedCoursesPort, SubscribedCourseViewQueryResult> {}
