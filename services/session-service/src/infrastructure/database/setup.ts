import type { ILogger } from '@/shared/common/interface/logger.interface';
import { DatabaseException } from '@/infrastructure/exceptions/database.exception';
import { dbConfig } from '@/shared/config/db.config';
import { container } from '@/shared/di/container';
import { TYPES } from '@/shared/di/types';
import mongoose from 'mongoose';

export class DatabaseClient {
  private readonly logger = container
    .get<ILogger>(TYPES.Logger)
    .fromContext('DATABASE_CLIENT');

  async connect(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (mongoose.connection.readyState === 1) {
      this.logger.info(`Connection already eshtablished to database`);
      return;
    }

    try {
      await mongoose.connect(dbConfig.MONGO_URI);
      this.logger.info(
        `Eshtablished connection to database @${mongoose.connection.host}:${mongoose.connection.port}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to eshtablish connection with database: ${(error as Record<string, any>).message}`,
        error as Record<string, any>,
      );
      throw new DatabaseException(
        (error as Record<string, any>).message as string,
      );
    }
  }
}
