import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { DatabaseException } from '@infrastructure/exceptions/DatabaseException';
import { DatabaseConfig } from '@shared/config/DatabaseConfig';
import { tryCatch } from '@shared/util/try-catch';
import mongoose from 'mongoose';
import { container } from 'src/di/RootModule';

export class MongooseConnection {
  private static readonly logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext('DATABASE_CLIENT');

  static async connect(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (mongoose.connection.readyState === 1) {
      this.logger.info(`Connection already eshtablished to database`);
      return;
    }

    const { error } = await tryCatch(
      mongoose.connect(DatabaseConfig.MONGO_URI),
    );

    if (error) {
      this.logger.error(
        `Failed to eshtablish connection with database: ${error.message}`,
        error as Record<string, any>,
      );
      if (error) {
        throw new DatabaseException(error.message);
      }
    }

    this.logger.info(`Eshtablished connection to database`);
  }
}
