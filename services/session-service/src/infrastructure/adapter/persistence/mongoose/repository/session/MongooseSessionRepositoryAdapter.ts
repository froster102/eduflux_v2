import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type { SessionQueryParameters } from '@core/application/session/port/persistence/type/SessionQueryParameters';
import type { SessionQueryResults } from '@core/application/session/port/persistence/type/SessionQueryResult';
import type { Session } from '@core/domain/session/entity/Session';
import { SessionStatus } from '@core/domain/session/enum/SessionStatus';
import { MongooseSessionMapper } from '@infrastructure/adapter/persistence/mongoose/model/session/mapper/MongooseSessionMapper';
import {
  SessionModel,
  type MongooseSession,
} from '@infrastructure/adapter/persistence/mongoose/model/session/MongooseSession';
import { MongooseBaseRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { unmanaged } from 'inversify';
import type { ClientSession, FilterQuery } from 'mongoose';

export class MongooseSessionRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Session, MongooseSession>
  implements SessionRepositoryPort
{
  constructor(
    @unmanaged()
    session?: ClientSession,
  ) {
    super(SessionModel, MongooseSessionMapper, session);
  }

  async findPendingExpired(
    now: Date,
    expiryMinutes: number,
  ): Promise<Session[]> {
    const cutoffTime = new Date(now.getTime() - expiryMinutes * 60 * 1000);
    const docs = await SessionModel.find({
      status: SessionStatus.PENDING_PAYMENT,
      createdAt: { $lt: cutoffTime },
    });
    return MongooseSessionMapper.toDomainEntities(docs);
  }

  async listSessions(
    participantId: string,
    query?: SessionQueryParameters,
  ): Promise<SessionQueryResults> {
    const dbQuery: FilterQuery<MongooseSession> = {};
    if (query?.type === 'instructor') {
      dbQuery.instructorId = participantId;
    } else {
      dbQuery.learnerId = participantId;
    }
    if (query) {
      if (query.filters) {
        if (query.filters.status) {
          dbQuery.status = query.filters.status;
        }
      }
    }
    const limit = query?.limit || this.defaultLimit;
    const skip = query?.offset || this.defaultOffset;

    const totalCount = await SessionModel.countDocuments(dbQuery);

    const sessions = await SessionModel.find(dbQuery).limit(limit).skip(skip);

    return {
      totalCount,
      sessions: MongooseSessionMapper.toDomainEntities(sessions),
    };
  }
}
