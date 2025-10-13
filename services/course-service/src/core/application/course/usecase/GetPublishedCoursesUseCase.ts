import type { CourseQueryResult } from '@core/application/course/port/persistence/types/CourseQueryResult';
import type { GetPublishedCoursesPort } from '@core/application/course/port/usecase/GetPublishedCoursesPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetPublishedCoursesUseCase
  extends UseCase<GetPublishedCoursesPort, CourseQueryResult> {}
