import type { EnrollmentStatus } from '@core/common/enums/EnrollmentStatus';
import type { QueryParameters } from '@core/common/port/persistence/type/QueryParameters';
import type { Enrollment } from '@core/domain/enrollment/entity/Enrollment';

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
