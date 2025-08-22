import type { ClientSession, FilterQuery } from 'mongoose';
import type { IMongoSession } from '../schema/session.schema';
import type { IMapper } from '@/infrastructure/mapper/mapper.interface';
import type {
  ISessionRepository,
  SessionQueryParameters,
  SessionQueryResults,
} from '@/domain/repositories/session.repository';
import { Session, SessionStatus } from '@/domain/entities/session.entity';
import { MongoBaseRepository } from './base.repository';
import { TYPES } from '@/shared/di/types';
import { inject, unmanaged } from 'inversify';
import SessionModel from '../models/session.model';

export class MongoSessionRepository
  extends MongoBaseRepository<Session, IMongoSession>
  implements ISessionRepository
{
  constructor(
    @inject(TYPES.SessionMapper)
    private readonly sessionMapper: IMapper<Session, IMongoSession>,
    @unmanaged()
    session?: ClientSession,
  ) {
    super(SessionModel, sessionMapper, session);
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
    return this.sessionMapper.toDomainArray(docs);
  }

  async listSessions(
    participantId: string,
    query?: SessionQueryParameters,
  ): Promise<SessionQueryResults> {
    const dbQuery: FilterQuery<IMongoSession> = {};
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
      sessions: this.sessionMapper.toDomainArray(sessions),
    };
  }
}
