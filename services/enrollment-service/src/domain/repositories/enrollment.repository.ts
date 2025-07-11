import { EnrollmentDto } from '@/application/dto/enrollment.dto';
import { PaginationQueryParams } from '@/application/dto/pagination.dto';
import { Enrollment } from '@/domain/enitites/enrollment.entity';
import { IBaseRepository } from '@/domain/repositories/base.repository';

export interface IEnrollmentRepository extends IBaseRepository<Enrollment> {
  findUserEnrollmentForCourse(
    userId: string,
    courseId: string,
  ): Promise<Enrollment | null>;
  findUserEnrollments(
    userId: string,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<{ total: number; enrollments: EnrollmentDto[] }>;
}
