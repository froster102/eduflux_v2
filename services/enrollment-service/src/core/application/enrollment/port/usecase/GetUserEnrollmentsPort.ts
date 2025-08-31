import type { EnrollmentQueryParameters } from '@core/application/enrollment/port/persistence/type/EnrollmentQueryTypes';

export interface GetUserEnrollmentsPorts {
  userId: string;
  queryParameters?: EnrollmentQueryParameters;
}
