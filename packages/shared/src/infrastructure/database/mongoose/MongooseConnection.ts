import type { LoggerPort } from '@shared/ports/logger/LoggerPort';
import mongoose, { STATES } from 'mongoose';
import { inject } from 'inversify';
import { tryCatch } from '@shared/utils/tryCatch';
import { SharedConfigDITokens } from '@shared/di/SharedConfigDITokens';
import type { MongooseConnectionConfig } from '@shared/config/MongooseConnectionConfig';
import { DatabaseException } from '@shared/exceptions/DatabaseException';
import { SharedCoreDITokens } from '@shared/di/SharedCoreDITokens';

export class MongooseConnection {
  constructor(
    @inject(SharedConfigDITokens.MongooseConnectionConfig)
    private readonly config: MongooseConnectionConfig,
    @inject(SharedCoreDITokens.Logger) private readonly logger: LoggerPort,
  ) {}

  async connect(): Promise<void> {
    if (mongoose.connection.readyState === STATES.connected) {
      this.logger.info('Database connection already established');
      return;
    }

    const { error } = await tryCatch(mongoose.connect(this.config.MONGO_URI));

    if (error) {
      this.logger.error(
        `Failed to establish database connection: ${error.message}`,
        error,
      );
      throw new DatabaseException();
    }

    this.logger.info('Successfully connected to MongoDB');
  }

  async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== STATES.disconnected) {
      await mongoose.disconnect();
      this.logger.info('Disconnected from MongoDB');
    }
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === STATES.connected;
  }
}
