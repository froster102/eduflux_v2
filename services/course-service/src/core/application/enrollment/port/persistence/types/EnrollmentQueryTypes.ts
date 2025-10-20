import type { QueryParameters } from '@core/common/port/persistence/types/QueryParameters';
import type { Enrollment } from '@core/domain/enrollment/entity/Enrollment';
import type { EnrollmentStatus } from '@core/domain/enrollment/enum/EnrollmentStatus';

export type EnrollmentFilters = {
  status: EnrollmentStatus;
};

export interface EnrollmentQueryParameters extends QueryParameters {
  filters?: Partial<EnrollmentFilters>;
}

export interface EnrollmentQueryResults {
  totalCount: number;
  enrollments: Enrollment[];
}
