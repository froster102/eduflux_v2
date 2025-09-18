import type { EnrollmentQueryParameters } from '@core/application/enrollment/port/persistence/type/EnrollmentQueryTypes';

export interface GetUserEnrollmentsPort {
  userId: string;
  queryParameters?: EnrollmentQueryParameters;
}
