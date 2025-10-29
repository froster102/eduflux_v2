import type { SubscribedCourseView } from '@application/views/subscribed-course/entity/SubscribedCourseView';

export interface SubscribedCourseViewQueryResult {
  totalCount: number;
  courses: SubscribedCourseView[];
}
