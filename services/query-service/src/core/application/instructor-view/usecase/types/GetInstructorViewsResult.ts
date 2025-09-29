import type { InstructorView } from "@core/domain/instructor-view/entity/InstructorView";

export type GetInstructorViewsResult = {
  instructors: InstructorView[];
  totalCount: number;
};
