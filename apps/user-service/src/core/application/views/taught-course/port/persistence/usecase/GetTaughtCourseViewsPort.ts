import type { TaughtCourseViewQueryParameters } from '@application/views/taught-course/port/persistence/types/TaughtCourseViewQueryParameters';

export interface GetTaughtCourseViewsPort {
  userId: string;
  query?: TaughtCourseViewQueryParameters;
}
