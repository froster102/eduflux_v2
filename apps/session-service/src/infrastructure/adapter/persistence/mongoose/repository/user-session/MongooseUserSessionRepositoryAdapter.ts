import type { UserSession } from '@core/application/views/user-session/entity/UserSession';
import type { UserSessionQueryParameters } from '@core/application/views/user-session/port/persistence/types/UserSessionQueryParameters';
import type { UserSessionQueryResult } from '@core/application/views/user-session/port/persistence/types/UserSessionQueryResult';
import type { UserSessionRepositoryPort } from '@core/application/views/user-session/port/persistence/UserSessionRepositoryPort';
import { Role } from '@eduflux-v2/shared/constants/Role';
import { MongooseUserSessionMapper } from '@infrastructure/adapter/persistence/mongoose/model/user-session/mapper/MongooseUserSessionMapper';
import {
  UserSessionModel,
  type MongooseUserSession,
} from '@infrastructure/adapter/persistence/mongoose/model/user-session/MongooseUserSession';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import type { FilterQuery } from 'mongoose';
import { SortOrder } from '@eduflux-v2/shared/constants/SortOrder';

export class MongooseUserSessionRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<UserSession, MongooseUserSession>
  implements UserSessionRepositoryPort
{
  constructor() {
    super(UserSessionModel, MongooseUserSessionMapper);
  }

  async upsert(session: UserSession): Promise<void> {
    await UserSessionModel.findOneAndUpdate(
      { _id: session.id },
      { $set: session },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async listUserSessions(
    userId: string,
    queryParameters?: UserSessionQueryParameters,
  ): Promise<UserSessionQueryResult> {
    const query: FilterQuery<MongooseUserSession> = {};
    const sortQuery: Record<string, 1 | -1> = {};
    if (queryParameters?.filter) {
      const { sort, status, preferedRole, search } = queryParameters.filter;
      if (status) {
        query.status = status;
      }
      if (search) {
        query.$text = { $search: search };
      }
      if (preferedRole) {
        if (preferedRole === Role.LEARNER) {
          query['learner.id'] = userId;
        } else if (preferedRole === Role.INSTRUCTOR) {
          query['instructor.id'] = userId;
        }
      }
      if (sort) {
        for (const [field, order] of Object.entries(sort)) {
          sortQuery[field] = order === SortOrder.ASC ? 1 : -1;
        }
      }
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
      'learner.name': payload.name,
    };
    if (payload.image !== undefined) {
      updateLearner['learner.image'] = payload.image;
    }

    const updateInstructor: Record<string, any> = {
      'instructor.name': payload.name,
    };
    if (payload.image !== undefined) {
      updateInstructor['instructor.image'] = payload.image;
    }

    await UserSessionModel.updateMany(
      { 'learner.id': userId },
      { $set: updateLearner },
    );

    await UserSessionModel.updateMany(
      { 'instructor.id': userId },
      { $set: updateInstructor },
    );
  }
}
