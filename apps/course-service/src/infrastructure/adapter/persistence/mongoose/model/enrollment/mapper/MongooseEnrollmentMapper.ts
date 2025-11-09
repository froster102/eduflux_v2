import { Enrollment } from '@core/domain/enrollment/entity/Enrollment';
import type { Mapper } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/mapper/MongooseBaseMapper';
import type { MongooseEnrollment } from '@infrastructure/adapter/persistence/mongoose/model/enrollment/MongooseEnrollment';

export class MongooseEnrollmentMapper
  implements Mapper<Enrollment, MongooseEnrollment>
{
  toDomain(document: MongooseEnrollment): Enrollment {
    return Enrollment.create({
      id: document._id,
      learnerId: document.learnerId,
      courseId: document.courseId,
      status: document.status,
      instructorId: document.instructorId,
      paymentId: document.paymentId,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  toPersistence(entity: Enrollment): Partial<MongooseEnrollment> {
    return {
      _id: entity.id,
      learnerId: entity.learnerId,
      courseId: entity.courseId,
      instructorId: entity.instructorId,
      status: entity.status,
      paymentId: entity.paymentId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomainEntities(documents: MongooseEnrollment[]): Enrollment[] {
    return documents.map((document) => this.toDomain(document));
  }
}
