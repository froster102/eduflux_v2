import { UserSession } from "@core/domain/user-session/entity/UserSession";
import type { MongooseUserSession } from "@infrastructure/adapter/persistence/mongoose/model/user-session/MongooseUserSession";
import type { SessionParticipant } from "@core/domain/user-session/entity/types/SessionParticipant";

export class MongooseUserSessionMapper {
  static toDomain(document: MongooseUserSession): UserSession {
    const learner: SessionParticipant = {
      id: document.learner.id,
      name: document.learner.name,
      image: document.learner.image,
    };

    const instructor: SessionParticipant = {
      id: document.instructor.id,
      name: document.instructor.name,
      image: document.instructor.image,
    };

    return UserSession.new({
      id: document._id,
      startTime: document.startTime,
      endTime: document.endTime,
      status: document.status,
      learner,
      instructor,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  static toPersistence(entity: UserSession): Partial<MongooseUserSession> {
    return {
      _id: entity.getId(),
      startTime: entity.startTime,
      endTime: entity.endTime,
      status: entity.status,
      learner: {
        id: entity.learner.id,
        name: entity.learner.name,
        image: entity.learner.image,
      },
      instructor: {
        id: entity.instructor.id,
        name: entity.instructor.name,
        image: entity.instructor.image,
      },
    };
  }

  static toDomainEntities(documents: MongooseUserSession[]): UserSession[] {
    return documents.map((document) => this.toDomain(document));
  }
}
