import type { InstructorView } from "@core/domain/instructor-view/entity/InstructorView";

export type InstructorViewQueryResult = {
  instructors: InstructorView[];
  totalCount: number;
};
