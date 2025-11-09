import type { InstructorView } from '@application/views/instructor-view/entity/InstructorView';

export type InstructorViewQueryResult = {
  instructors: InstructorView[];
  totalCount: number;
};
