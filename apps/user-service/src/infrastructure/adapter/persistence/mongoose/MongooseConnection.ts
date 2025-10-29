import { CoreDITokens } from '@eduflux-v2/shared/di/CoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { container } from '@di/RootModule';
import { DatabaseConfig } from '@infrastructure/config/DatabaseConfig';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import mongoose from 'mongoose';
import { DatabaseException } from '@eduflux-v2/shared/exceptions/DatabaseException';

export class MongooseConnection {
  private static readonly logger = container
    .get<LoggerPort>(CoreDITokens.Logger)
    .fromContext('DATABASE');

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
        `Failed to eshtablish connection with database: ${(error as Record<string, any>).message}`,
        error as Record<string, any>,
      );
      throw new DatabaseException();
    }

    this.logger.info(`Eshtablished connection to database`);
  }
}
