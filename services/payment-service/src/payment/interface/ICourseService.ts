import type { Course } from '@shared/types/Course';
import type { Enrollment } from '@shared/types/Enrollment';

export interface ICourseService {
  getCourse(courseId: string): Promise<Course>;
  getEnrollment(enrollmentId: string): Promise<Enrollment>;
}
