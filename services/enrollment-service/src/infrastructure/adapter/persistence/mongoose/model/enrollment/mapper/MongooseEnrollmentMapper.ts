import { Enrollment } from '@core/domain/enrollment/entity/Enrollment';
import type { MongooseEnrollment } from '@infrastructure/adapter/persistence/mongoose/model/enrollment/MongooseEnrollment';

export class MongooseEnrollmentMapper {
  static toDomain(document: MongooseEnrollment): Enrollment {
    return Enrollment.create({
      id: document._id,
      userId: document.userId,
      courseId: document.courseId,
      status: document.status,
      instructorId: document.instructorId,
      paymentId: document.paymentId,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  static toPersistence(entity: Enrollment): Partial<MongooseEnrollment> {
    return {
      _id: entity.id,
      userId: entity.userId,
      courseId: entity.courseId,
      instructorId: entity.instructorId,
      status: entity.status,
      paymentId: entity.paymentId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDomainEntities(documents: MongooseEnrollment[]): Enrollment[] {
    return documents.map((document) => this.toDomain(document));
  }
}
