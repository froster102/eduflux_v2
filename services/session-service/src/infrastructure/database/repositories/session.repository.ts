import type { ClientSession } from 'mongoose';
import type { IMongoSession } from '../schema/session.schema';
import type { IMapper } from '@/infrastructure/mapper/mapper.interface';
import type { ISessionRepository } from '@/domain/repositories/session.repository';
import { Session, SessionStatus } from '@/domain/entities/session.entity';
import { MongoBaseRepository } from './base.repository';
import { TYPES } from '@/shared/di/types';
import { inject, unmanaged } from 'inversify';
import SessionModel from '../models/session.model';
import type { QueryOptions } from '@/application/dto/query-options.dto';
import type { GetUserBookingsQueryOptions } from '@/application/use-cases/interface/get-user-bookings.interface';

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

  async findLearnerSessions(
    learnerId: string,
    queryOptions: GetUserBookingsQueryOptions,
  ): Promise<{ sessions: Session[]; total: number }> {
    const { query, options } = this._buildQuery(queryOptions);

    if (queryOptions.filters) {
      const { status, startTime_gte, endTime_lte } = queryOptions.filters;
      if (status) {
        query.status = status;
      }
      if (startTime_gte) {
        query.startTime = { $gte: startTime_gte };
      }
      if (endTime_lte) {
        query.endTime = { $lte: endTime_lte };
      }
    }

    const finalQuery = { ...query, learnerId };

    const total = await SessionModel.countDocuments(finalQuery);

    const result = await SessionModel.find(
      { ...query, learnerId },
      null,
      options,
    );

    return result
      ? {
          sessions: this.sessionMapper.toDomainArray(result),
          total,
        }
      : { sessions: [], total };
  }

  async findInstructorSessions(
    instructorId: string,
    queryOptions: QueryOptions,
  ): Promise<{ sessions: Session[]; total: number }> {
    const { query, options } = this._buildQuery(queryOptions);

    const total = await SessionModel.countDocuments(query);

    const result = await SessionModel.find(
      { ...query, instructorId },
      null,
      options,
    );

    return result
      ? {
          sessions: this.sessionMapper.toDomainArray(result),
          total,
        }
      : { sessions: [], total };
  }

  private _buildQuery(queryOptions: QueryOptions): {
    query: Record<string, any>;
    options: Record<string, any>;
  } {
    const {
      page = 1,
      pageSize = 10,
      searchQuery,
      searchFields,
      filters,
      sortBy,
      sortOrder = 'asc',
    } = queryOptions;

    const query: Record<string, any> = {};
    const options: Record<string, any> = {};

    if (searchQuery && searchFields && searchFields.length > 0) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: searchQuery, $options: 'i' },
      }));
    }

    if (filters) {
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          const value = filters[key];
          if (Array.isArray(value)) {
            query[key] = { $in: value };
          } else {
            query[key] = value;
          }
        }
      }
    }

    const skip = (page - 1) * pageSize;
    options.skip = skip;
    options.limit = pageSize;

    if (sortBy) {
      options.sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    }

    return { query, options };
  }
}
