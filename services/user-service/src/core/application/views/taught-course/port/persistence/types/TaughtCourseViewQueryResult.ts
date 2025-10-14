import type { TaughtCourseView } from '@core/application/views/taught-course/entity/TaughtCourseView';

export type TaughtCourseViewQueryResult = {
  totalCount: number;
  courses: TaughtCourseView[];
};
