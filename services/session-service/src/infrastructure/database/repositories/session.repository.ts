import type { IMongoSession } from '../schema/session.schema';
import type { IMapper } from '@/infrastructure/mapper/mapper.interface';
import type { ISessionRepository } from '@/domain/repositories/session.repository';
import { Session } from '@/domain/entities/session.entity';
import { MongoBaseRepository } from './base.repository';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import SessionModel from '../models/session.model';

export class MongoSessionRepository
  extends MongoBaseRepository<Session, IMongoSession>
  implements ISessionRepository
{
  constructor(
    @inject(TYPES.SessionMapper)
    private readonly sessionMapper: IMapper<Session, IMongoSession>,
  ) {
    super(SessionModel, sessionMapper);
  }
}
