import type { InstructorView } from '@core/application/views/instructor-view/entity/InstructorView';

export type GetInstructorViewsResult = {
  instructors: InstructorView[];
  totalCount: number;
};
