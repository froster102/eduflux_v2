import type { CourseQueryResult } from '@core/application/course/port/persistence/types/CourseQueryResult';
import type { GetAllInstructorCoursesPort } from '@core/application/course/port/usecase/GetAllInstructorCoursesPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetAllInstructorCoursesUseCase
  extends UseCase<GetAllInstructorCoursesPort, CourseQueryResult> {}
