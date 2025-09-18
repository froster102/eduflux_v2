import type { SessionSettingsRepositoryPort } from '@core/application/session-settings/port/persistence/SessionSettingsPort';
import type { SessionRepositoryPort } from '@core/application/session/port/persistence/SessionRepositoryPort';
import type { SlotRepositoryPort } from '@core/application/slot/port/persistence/SlotRepositoryPort';
import type { UnitOfWork } from '@core/common/unit-of-work/UnitOfWork';
import { MongooseSessionSettingsRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/session-settings/MongooseSessionSettingsRepositoryAdapter';
import { MongooseSessionRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/session/MongooseSessionRepositoryAdapter';
import { MongooseSlotRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/slot/MongooseSlotRepositoryAdapter';
import { DatabaseException } from '@infrastructure/exceptions/database.exception';
import { unmanaged } from 'inversify';
import type { ClientSession } from 'mongoose';
import mongoose from 'mongoose';

export class MongooseUnitOfWork implements UnitOfWork {
  private _slotRepository: SlotRepositoryPort | undefined;
  private _sessionRepository: SessionRepositoryPort | undefined;
  private _sessionSettingsRepository: SessionSettingsRepositoryPort | undefined;

  private session?: ClientSession;

  constructor(@unmanaged() session?: ClientSession) {
    this.session = session;
  }

  get slotRepository(): SlotRepositoryPort {
    if (!this.session) {
      throw new DatabaseException(
        'Unit of Work session not initialized. Call commit() first for transactional operations.',
      );
    }
    if (!this._slotRepository) {
      this._slotRepository = new MongooseSlotRepositoryAdapter(this.session);
    }
    return this._slotRepository;
  }

  get sessionRepository(): SessionRepositoryPort {
    if (!this.session) {
      throw new DatabaseException(
        'Unit of Work session not initialized. Call commit() first for transactional operations.',
      );
    }
    if (!this._sessionRepository) {
      this._sessionRepository = new MongooseSessionRepositoryAdapter(
        this.session,
      );
    }
    return this._sessionRepository;
  }

  get sessionSettingsRepository(): SessionSettingsRepositoryPort {
    if (!this.session) {
      throw new DatabaseException(
        'Unit of Work session not initialized. Call commit() first for transactional operations.',
      );
    }
    if (!this._sessionSettingsRepository) {
      this._sessionSettingsRepository =
        new MongooseSessionSettingsRepositoryAdapter(this.session);
    }
    return this._sessionSettingsRepository;
  }

  async runTransaction<T>(
    callback: (uow: UnitOfWork) => Promise<T>,
  ): Promise<T> {
    if (this.session) {
      return await callback(this);
    }
    const session = await mongoose.startSession();

    session.startTransaction();
    try {
      const transactionalUow = new MongooseUnitOfWork(session);
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
