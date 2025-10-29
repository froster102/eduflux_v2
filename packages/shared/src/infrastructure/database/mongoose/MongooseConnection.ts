import type { LoggerPort } from '@shared/ports/logger/LoggerPort';
import mongoose, { ConnectionStates } from 'mongoose';
import { inject } from 'inversify';
import { tryCatch } from '@shared/utils/tryCatch';
import { CoreDITokens } from '@shared/di/CoreDITokens';
import type { MongooseConnectionConfig } from '@shared/config/MongooseConnectionConfig';
import { DatabaseException } from '@shared/exceptions/DatabaseException';

export class MongooseConnection {
  constructor(
    @inject(CoreDITokens.MongooseConnectionConfig)
    private readonly config: MongooseConnectionConfig,
    private readonly logger: LoggerPort,
  ) {}

  async connect(): Promise<void> {
    if (mongoose.connection.readyState === ConnectionStates.connected) {
      this.logger.info('Database connection already established');
      return;
    }

    const { error } = await tryCatch(mongoose.connect(this.config.MONGO_URI));

    if (error) {
      this.logger.error(
        `Failed to establish database connection: ${(error as Record<string, any>).message}`,
        error as Record<string, any>,
      );
      throw new DatabaseException();
    }

    this.logger.info('Successfully connected to MongoDB');
  }

  async disconnect(): Promise<void> {
    if (mongoose.connection.readyState !== ConnectionStates.disconnected) {
      await mongoose.disconnect();
      this.logger.info('Disconnected from MongoDB');
    }
  }

  isConnected(): boolean {
    return mongoose.connection.readyState === ConnectionStates.connected;
  }
}
