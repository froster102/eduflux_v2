import type { InstructorView } from '@core/application/views/instructor-view/entity/InstructorView';

export type InstructorViewQueryResult = {
  instructors: InstructorView[];
  totalCount: number;
};
