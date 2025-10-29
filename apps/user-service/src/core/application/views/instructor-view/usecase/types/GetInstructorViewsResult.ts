import type { InstructorView } from '@application/views/instructor-view/entity/InstructorView';

export type GetInstructorViewsResult = {
  instructors: InstructorView[];
  totalCount: number;
};
