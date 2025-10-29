import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { container } from '@di/RootModule';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import { DatabaseException } from '@infrastructure/exceptions/DatabaseException';
import { DatabaseConfig } from '@shared/config/DatabaseConfig';
import mongoose from 'mongoose';

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
        throw new DatabaseException();
      }
    }

    this.logger.info(`Eshtablished connection to database`);
  }
}
