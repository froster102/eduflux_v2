import type { SubscribedCourseView } from '@core/application/views/subscribed-course/entity/SubscribedCourseView';

export interface SubscribedCourseViewQueryResult {
  totalCount: number;
  courses: SubscribedCourseView[];
}
