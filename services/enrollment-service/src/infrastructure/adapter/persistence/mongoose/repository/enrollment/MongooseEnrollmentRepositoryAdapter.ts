import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import type {
  EnrollmentQueryParameters,
  EnrollmentQueryResults,
} from '@core/application/enrollment/port/persistence/type/EnrollmentQueryTypes';
import { Enrollment } from '@core/domain/enrollment/entity/Enrollment';
import { MongooseBaseRepositoryAdpater } from '@infrastructure/adapter/persistence/mongoose/base/MongooseBaseRepositoryAdapter';
import { MongooseEnrollmentMapper } from '@infrastructure/adapter/persistence/mongoose/model/enrollment/mapper/MongooseEnrollmentMapper';
import {
  EnrollmentModel,
  type MongooseEnrollment,
} from '@infrastructure/adapter/persistence/mongoose/model/enrollment/MongooseEnrollment';
import type { FilterQuery } from 'mongoose';

export class MongooseEnrollmentRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<MongooseEnrollment, Enrollment>
  implements EnrollmentRepositoryPort
{
  constructor() {
    super(EnrollmentModel, MongooseEnrollmentMapper);
  }

  async findUserEnrollmentForCourse(
    userId: string,
    courseId: string,
  ): Promise<Enrollment | null> {
    const enrollment = await EnrollmentModel.findOne({ userId, courseId });
    return enrollment ? MongooseEnrollmentMapper.toDomain(enrollment) : null;
  }

  async findUserEnrollments(
    userId: string,
    queryParameters?: EnrollmentQueryParameters,
  ): Promise<EnrollmentQueryResults> {
    const query: FilterQuery<MongooseEnrollment> = {
      userId,
    };
    if (queryParameters) {
      if (queryParameters.filters) {
        if (queryParameters.filters.status) {
          query.status = queryParameters.filters.status;
        }
      }
    }
    const totalCount = await EnrollmentModel.countDocuments(query);
    const enrollments = await EnrollmentModel.find(query)
      .limit(queryParameters?.limit || this.defaultLimit)
      .skip(queryParameters?.offset || this.defaultOffset);

    return {
      totalCount,
      enrollments: MongooseEnrollmentMapper.toDomainEntities(enrollments),
    };
  }

  async findEnrollmentWithUserAndInstructorId(
    userId: string,
    instructorId: string,
  ): Promise<Enrollment | null> {
    const enrollment = await EnrollmentModel.findOne({ userId, instructorId });
    return enrollment ? MongooseEnrollmentMapper.toDomain(enrollment) : null;
  }
}
