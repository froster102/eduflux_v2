import type { InstructorViewQueryParameters } from '@core/application/views/instructor-view/port/persistence/types/InstructorViewQueryParameters';

export interface GetInstructorViewsPort {
  executorId?: string;
  queryParameters: InstructorViewQueryParameters;
}
