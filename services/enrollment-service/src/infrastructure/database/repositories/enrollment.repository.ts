import type { IMapper } from '@/infrastructure/mapper/interface/mapper.interface';
import { Enrollment } from '@/domain/enitites/enrollment.entity';
import { MongoBaseRepository } from './base.repository';
import EnrollmentModel from '../models/enrollment.model';
import { IEnrollment } from '../schema/enrollment.schema';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { IEnrollmentRepository } from '@/domain/repositories/enrollment.repository';
import { EnrollmentDto } from '@/application/dto/enrollment.dto';
import { PaginationQueryParams } from '@/application/dto/pagination.dto';

export class EnrollmentRepository
  extends MongoBaseRepository<Enrollment, IEnrollment>
  implements IEnrollmentRepository
{
  constructor(
    @inject(TYPES.EnrollmentMapper)
    private enrollmentMapper: IMapper<Enrollment, IEnrollment>,
  ) {
    super(EnrollmentModel, enrollmentMapper);
  }

  async findUserEnrollmentForCourse(
    userId: string,
    courseId: string,
  ): Promise<Enrollment | null> {
    const enrollment = await EnrollmentModel.findOne({ userId, courseId });
    return enrollment ? this.enrollmentMapper.toDomain(enrollment) : null;
  }

  async findUserEnrollments(
    userId: string,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<{ total: number; enrollments: EnrollmentDto[] }> {
    const {
      page = 1,
      limit = 10,
      searchQuery,
      searchFields,
      filters,
      sortBy,
      sortOrder = 'desc',
    } = paginationQueryParams;

    const query: Record<string, any> = {};
    const options: Record<string, any> = {};

    if (searchQuery && searchFields && searchFields.length > 0) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: searchQuery, $options: 'i' },
      }));
    }

    if (filters) {
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          const value = filters[key];
          if (Array.isArray(value)) {
            query[key] = { $in: value };
          } else {
            query[key] = value;
          }
        }
      }
    }

    const skip = (page - 1) * limit;
    options.skip = skip;
    options.limit = limit;

    if (sortBy) {
      options.sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    }

    const total = await EnrollmentModel.countDocuments();

    const results = await EnrollmentModel.find(query, null, options);

    const enrollments: EnrollmentDto[] =
      results && results.length > 0
        ? results.map((result) => ({
            id: (result._id as string).toString(),
            userId: result.userId,
            courseId: result.courseId,
            status: result.status,
            paymentId: result.paymentId as string,
            createdAt: result.createdAt.toISOString(),
            updatedAt: result.updatedAt.toISOString(),
          }))
        : [];

    return { total, enrollments };
  }
}
