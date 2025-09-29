import type { InstructorViewQueryParameters } from "@core/application/instructor-view/port/persistence/types/InstructorViewQueryParameters";

export interface GetInstructorViewsPort {
  executorId?: string;
  queryParameters: InstructorViewQueryParameters;
}
