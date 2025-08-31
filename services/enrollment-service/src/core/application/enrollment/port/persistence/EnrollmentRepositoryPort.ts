import type {
  EnrollmentQueryParameters,
  EnrollmentQueryResults,
} from '@core/application/enrollment/port/persistence/type/EnrollmentQueryTypes';
import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import type { Enrollment } from '@core/domain/enrollment/entity/Enrollment';

export interface EnrollmentRepositoryPort
  extends BaseRepositoryPort<Enrollment> {
  findUserEnrollmentForCourse(
    userId: string,
    courseId: string,
  ): Promise<Enrollment | null>;
  findUserEnrollments(
    userId: string,
    queryParameters?: EnrollmentQueryParameters,
  ): Promise<EnrollmentQueryResults>;
  findEnrollmentWithUserAndInstructorId(
    userId: string,
    instructorId: string,
  ): Promise<Enrollment | null>;
}
