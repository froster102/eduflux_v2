import type { Instructor } from '@domain/instructor/entity/Instructor';

export type InstructorQueryResults = {
  instructors: Instructor[];
  totalCount: number;
};
