import { dbConfig } from '@/shared/config/db.config';
import mongoose from 'mongoose';
import { DatabaseException } from '../exceptions/database.exception';
import { container } from '@/shared/di/container';
import type { ILogger } from '@/shared/common/interface/logger.interface';
import { TYPES } from '@/shared/di/types';

export class DatabaseClient {
  private readonly logger = container
    .get<ILogger>(TYPES.Logger)
    .fromContext('DATABASE');

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
