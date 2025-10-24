import type { CourseQueryParameters } from '@core/application/course/port/persistence/types/CourseQueryParameters';

export interface GetPublishedCoursesPort {
  query?: CourseQueryParameters;
}
