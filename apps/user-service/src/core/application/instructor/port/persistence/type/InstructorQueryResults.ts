import type { Instructor } from '@core/domain/instructor/entity/Instructor';

export type InstructorQueryResults = {
  instructors: Instructor[];
  totalCount: number;
};
