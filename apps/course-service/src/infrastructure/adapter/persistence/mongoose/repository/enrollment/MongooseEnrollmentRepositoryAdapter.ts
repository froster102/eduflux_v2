import type { EnrollmentRepositoryPort } from '@core/application/enrollment/port/persistence/EnrollmentRepositoryPort';
import type {
  EnrollmentQueryParameters,
  EnrollmentQueryResults,
} from '@core/application/enrollment/port/persistence/types/EnrollmentQueryTypes';
import { Enrollment } from '@core/domain/enrollment/entity/Enrollment';
import { MongooseEnrollmentMapper } from '@infrastructure/adapter/persistence/mongoose/model/enrollment/mapper/MongooseEnrollmentMapper';
import {
  EnrollmentModel,
  type MongooseEnrollment,
} from '@infrastructure/adapter/persistence/mongoose/model/enrollment/MongooseEnrollment';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import type { FilterQuery } from 'mongoose';

export class MongooseEnrollmentRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Enrollment, MongooseEnrollment>
  implements EnrollmentRepositoryPort
{
  constructor() {
    super(EnrollmentModel, new MongooseEnrollmentMapper());
  }

  async findUserEnrollmentForCourse(
    learnerId: string,
    courseId: string,
  ): Promise<Enrollment | null> {
    const enrollment = await EnrollmentModel.findOne({ learnerId, courseId });
    return enrollment ? this.mapper.toDomain(enrollment) : null;
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
      enrollments: this.mapper.toDomainEntities(enrollments),
    };
  }

  async findEnrollmentWithLearnerAndInstructorId(
    learnerId: string,
    instructorId: string,
  ): Promise<Enrollment | null> {
    const enrollment = await EnrollmentModel.findOne({
      learnerId,
      instructorId,
    });
    return enrollment ? this.mapper.toDomain(enrollment) : null;
  }

  async findByUserAndCourseId(
    userId: string,
    courseId: string,
  ): Promise<Enrollment | null> {
    const doc = await EnrollmentModel.findOne({
      learnerId: userId,
      courseId: courseId,
    });
    return doc ? this.mapper.toDomain(doc) : null;
  }
}
