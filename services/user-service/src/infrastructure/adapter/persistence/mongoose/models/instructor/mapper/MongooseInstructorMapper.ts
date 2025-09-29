import { Instructor } from '@core/domain/instructor/entity/Instructor';
import type { MongooseInstructor } from '@infrastructure/adapter/persistence/mongoose/models/instructor/MongooseInstructor';

export class InstructorMapper {
  static toDomain(mongooseInstructor: MongooseInstructor): Instructor {
    const domainInstructor: Instructor = new Instructor({
      id: mongooseInstructor._id,
      sessionsConducted: mongooseInstructor.sessionsConducted,
      totalCourses: mongooseInstructor.totalCourses,
      isSessionEnabled: mongooseInstructor.isSessionEnabled,
      totalLearners: mongooseInstructor.totalLearners,
      createdAt: mongooseInstructor.createdAt,
      updatedAt: mongooseInstructor.updatedAt,
    });
    return domainInstructor;
  }

  static toPersistence(
    domainInstructor: Instructor,
  ): Partial<MongooseInstructor> {
    const mongooseInstructor: Partial<MongooseInstructor> = {
      _id: domainInstructor.getId(),
      sessionsConducted: domainInstructor.getSessionsConducted(),
      isSessionEnabled: domainInstructor.getIsSessionEnabled(),
      totalCourses: domainInstructor.getTotalCourses(),
      totalLearners: domainInstructor.getTotalLearners(),
      createdAt: domainInstructor.getCreatedAt(),
      updatedAt: domainInstructor.getUpdatedAt(),
    };
    return mongooseInstructor;
  }

  static toDomainEntities(raw: MongooseInstructor[]): Instructor[] {
    return raw.map((r) => this.toDomain(r));
  }
}
