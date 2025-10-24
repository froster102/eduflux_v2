import type { CourseQueryParameters } from '@core/application/course/port/persistence/types/CourseQueryParameters';
import type { AuthenticatedUserDto } from '@core/common/dto/AuthenticatedUserDto';

export interface GetAllInstructorCoursesPort {
  actor: AuthenticatedUserDto;
  query?: CourseQueryParameters;
}
