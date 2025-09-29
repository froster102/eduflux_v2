import type { UserSessionRepositoryPort } from "@core/application/user-session/port/persistence/UserSessionRepositoryPort";
import type { UserSessionQueryParameters } from "@core/application/user-session/port/persistence/type/UserSessionQueryParameters";
import type { UserSessionQueryResult } from "@core/application/user-session/port/persistence/type/UserSessionQueryResult";
import { UserSession } from "@core/domain/user-session/entity/UserSession";
import { Role } from "@shared/constants/roles";
import { MongooseBaseRepositoryAdpater } from "@infrastructure/adapter/persistence/mongoose/base/MongooseBaseRepositoryAdapter";
import { MongooseUserSessionMapper } from "@infrastructure/adapter/persistence/mongoose/model/user-session/mapper/MongooseUserSessionMapper";
import {
  UserSessionModel,
  type MongooseUserSession,
} from "@infrastructure/adapter/persistence/mongoose/model/user-session/MongooseUserSession";
import type { FilterQuery } from "mongoose";

export class MongooseUserSessionRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<MongooseUserSession, UserSession>
  implements UserSessionRepositoryPort
{
  constructor() {
    super(UserSessionModel, MongooseUserSessionMapper);
  }

  async listUserSessions(
    userId: string,
    preferedRole: Role,
    queryParameters?: UserSessionQueryParameters,
  ): Promise<UserSessionQueryResult> {
    const query: FilterQuery<MongooseUserSession> = {};

    if (preferedRole === Role.LEARNER) {
      query["learner.id"] = userId;
    } else if (preferedRole === Role.INSTRUCTOR) {
      query["instructor.id"] = userId;
    }

    if (queryParameters?.status) {
      query.status = queryParameters.status;
    }

    const totalCount = await UserSessionModel.countDocuments(query);
    const sessions = await UserSessionModel.find(query)
      .limit(queryParameters?.limit || this.defaultLimit)
      .skip(queryParameters?.offset || this.defaultOffset);

    return {
      totalCount,
      sessions: MongooseUserSessionMapper.toDomainEntities(sessions),
    };
  }

  async updateUser(
    userId: string,
    payload: { name: string; image?: string },
  ): Promise<void> {
    const updateLearner: Record<string, any> = {
      "learner.name": payload.name,
    };
    if (payload.image !== undefined) {
      updateLearner["learner.image"] = payload.image;
    }

    const updateInstructor: Record<string, any> = {
      "instructor.name": payload.name,
    };
    if (payload.image !== undefined) {
      updateInstructor["instructor.image"] = payload.image;
    }

    await UserSessionModel.updateMany(
      { "learner.id": userId },
      { $set: updateLearner },
    );

    await UserSessionModel.updateMany(
      { "instructor.id": userId },
      { $set: updateInstructor },
    );
  }
}
