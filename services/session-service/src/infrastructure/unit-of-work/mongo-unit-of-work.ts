import type { ClientSession } from 'mongoose';
import type { IUnitOfWork } from '@/application/ports/unit-of-work.interface';
import type { ISessionRepository } from '@/domain/repositories/session.repository';
import type { ISlotRepository } from '@/domain/repositories/slot.repository';
import mongoose from 'mongoose';
import { DatabaseException } from '../exceptions/database.exception';
import { injectable, unmanaged } from 'inversify';
import { MongoSlotRepository } from '../database/repositories/slot.repository';
import { SlotMapper } from '../mapper/slot.mapper';
import { SessionMapper } from '../mapper/session.mapper';
import { MongoSessionRepository } from '../database/repositories/session.repository';
import { ScheduleSettingMapper } from '../mapper/session-settings.mapper';
import type { ISessionSettingsRepository } from '@/domain/repositories/session-settings.repository';
import { MongoSessionSettingsRepository } from '../database/repositories/session-settings.repository';

@injectable()
export class MongoUnitOfWork implements IUnitOfWork {
  private _slotRepository: ISlotRepository | undefined;
  private _sessionRepository: ISessionRepository | undefined;
  private _sessionSettingsRepository: ISessionSettingsRepository | undefined;

  private session?: ClientSession;

  constructor(@unmanaged() session?: ClientSession) {
    this.session = session;
  }

  get slotRepository(): ISlotRepository {
    if (!this.session) {
      throw new DatabaseException(
        'Unit of Work session not initialized. Call commit() first for transactional operations.',
      );
    }
    if (!this._slotRepository) {
      this._slotRepository = new MongoSlotRepository(
        new SlotMapper(),
        this.session,
      );
    }
    return this._slotRepository;
  }

  get sessionRepository(): ISessionRepository {
    if (!this.session) {
      throw new DatabaseException(
        'Unit of Work session not initialized. Call commit() first for transactional operations.',
      );
    }
    if (!this._sessionRepository) {
      this._sessionRepository = new MongoSessionRepository(
        new SessionMapper(),
        this.session,
      );
    }
    return this._sessionRepository;
  }

  get sessionSettingsRepository(): ISessionSettingsRepository {
    if (!this.session) {
      throw new DatabaseException(
        'Unit of Work session not initialized. Call commit() first for transactional operations.',
      );
    }
    if (!this._sessionSettingsRepository) {
      this._sessionSettingsRepository = new MongoSessionSettingsRepository(
        new ScheduleSettingMapper(),
        this.session,
      );
    }
    return this._sessionSettingsRepository;
  }

  async runTransaction<T>(
    callback: (uow: IUnitOfWork) => Promise<T>,
  ): Promise<T> {
    if (this.session) {
      return await callback(this);
    }
    const session = await mongoose.startSession();

    session.startTransaction();
    try {
      const transactionalUow = new MongoUnitOfWork(session);
      const result = await callback(transactionalUow);

      await session.commitTransaction();

      return result;
    } catch (error) {
      await session.abortTransaction();
      throw new DatabaseException(
        (error as Record<string, any>).message as string,
      );
    } finally {
      await session.endSession();
    }
  }
  rollback(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
