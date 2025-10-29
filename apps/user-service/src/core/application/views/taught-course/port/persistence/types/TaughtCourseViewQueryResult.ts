import type { TaughtCourseView } from '@application/views/taught-course/entity/TaughtCourseView';

export type TaughtCourseViewQueryResult = {
  totalCount: number;
  courses: TaughtCourseView[];
};
