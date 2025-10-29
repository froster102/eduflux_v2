import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { DatabaseException } from '@infrastructure/database/exception/DatabaseException';
import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import mongoose from 'mongoose';
import { DatabaseConfig } from '@shared/config/DatabaseConfig';
import { container } from '@application/di/RootModule';

export class MongooseConnection {
  private static logger: LoggerPort;

  static async connect(): Promise<void> {
    this.logger = container
      .get<LoggerPort>(CoreDITokens.Logger)
      .fromContext('DATABASE_CLIENT');
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
