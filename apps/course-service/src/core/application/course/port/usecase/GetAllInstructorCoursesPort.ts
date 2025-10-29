import type { CourseQueryParameters } from '@core/application/course/port/persistence/types/CourseQueryParameters';
import type { AuthenticatedUserDto } from '@eduflux-v2/shared/dto/AuthenticatedUserDto';

export interface GetAllInstructorCoursesPort {
  actor: AuthenticatedUserDto;
  query?: CourseQueryParameters;
}
