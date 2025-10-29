import type { SubscribedCourseViewQueryParameters } from '@application/views/subscribed-course/port/persistence/types/SubscribedCourseViewQueryParameters';

export interface GetSubscribedCoursesPort {
  userId: string;
  query?: SubscribedCourseViewQueryParameters;
}
