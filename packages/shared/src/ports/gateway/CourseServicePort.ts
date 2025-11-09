import type { Course } from '@shared/types/course';
import type { Enrollment } from '@shared/types/enrollment';

export interface CourseServicePort {
  getCourse(courseId: string): Promise<Course>;
  getEnrollment(enrollmentId: string): Promise<Enrollment>;
  verifyChatAccess(
    instructorId: string,
    learnerId: string,
  ): Promise<{
    hasAccess: boolean;
  }>;
}
