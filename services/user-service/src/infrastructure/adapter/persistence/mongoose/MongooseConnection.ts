import { container } from '@application/di/RootModule';
import { CoreDITokens } from '@core/common/di/CoreDITokens';
import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';
import type { LoggerPort } from '@core/common/port/LoggerPort';
import { DatabaseConfig } from '@infrastructure/config/DatabaseConfig';
import { tryCatch } from '@shared/utils/try-catch';
import mongoose from 'mongoose';

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
      throw Exception.new({ code: Code.INTERNAL_ERROR });
    }

    this.logger.info(`Eshtablished connection to database`);
  }
}
