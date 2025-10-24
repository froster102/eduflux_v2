import type { Course } from '@core/domain/course/entity/Course';

export interface CourseQueryResult {
  totalCount: number;
  courses: Course[];
}
