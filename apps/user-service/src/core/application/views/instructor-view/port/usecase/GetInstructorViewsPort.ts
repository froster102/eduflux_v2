import type { InstructorViewQueryParameters } from '@application/views/instructor-view/port/persistence/types/InstructorViewQueryParameters';

export interface GetInstructorViewsPort {
  executorId?: string;
  queryParameters: InstructorViewQueryParameters;
}
