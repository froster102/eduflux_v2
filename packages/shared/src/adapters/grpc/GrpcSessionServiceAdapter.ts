import { credentials, type ServiceError } from '@grpc/grpc-js';
import type { LoggerPort } from '@shared/ports/logger/LoggerPort';

import { createClientLoggingInterceptor } from '@shared/adapters/grpc/interceptors/clientLoggingInterceptor';
import { SharedCoreDITokens } from '@shared/di/SharedCoreDITokens';
import { inject } from 'inversify';
import type { GrpcSessionServiceConfig } from '@shared/config/GrpcSessionServiceConfig';
import {
  BookSessionRequest,
  GetSessionRequest,
  Session,
  SessionServiceClient,
} from '@shared/adapters/grpc/generated/session';
import { SharedConfigDITokens } from '@shared/di/SharedConfigDITokens';
import type { SessionServicePort } from '@shared/ports/gateway/SessionServicePort';

export class GrpcSessionServiceAdapter implements SessionServicePort {
  private client: SessionServiceClient;
  private address: string;

  constructor(
    @inject(SharedCoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(SharedConfigDITokens.GrpcSessionServiceConfig)
    private readonly config: GrpcSessionServiceConfig,
  ) {
    this.logger = logger.fromContext(GrpcSessionServiceAdapter.name);
    this.address = this.config.GRPC_SESSION_SERVICE_URL;
    this.client = new SessionServiceClient(
      this.address,
      credentials.createInsecure(),
      {
        interceptors: [createClientLoggingInterceptor(this.logger)],
      },
    );
    this.logger.info(
      `gRPC session service client initialized, target:${this.address}`,
    );
  }

  async getSession(sessionId: string): Promise<Session> {
    const request: GetSessionRequest = { id: sessionId };

    return new Promise((resolve, reject) => {
      this.client.getSession(
        request,
        (error: ServiceError | null, response: Session | null) => {
          if (error) {
            this.logger.error(
              `Error fetching session details: ${error.message}`,
            );
            reject(new Error(error.message));
          }
          if (response) {
            resolve(response);
          }
        },
      );
    });
  }

  async bookSession(request: BookSessionRequest): Promise<Session> {
    const bookSessionRequest: BookSessionRequest = {
      slotId: request.slotId,
      userId: request.userId,
    };

    return new Promise((resolve, reject) => {
      this.client.bookSession(
        bookSessionRequest,
        (error: ServiceError | null, response: Session | null) => {
          if (error) {
            this.logger.error(
              `Error fetching session details: ${error.message}`,
            );
            reject(new Error(error.message));
          }
          if (response) {
            resolve(response);
          }
        },
      );
    });
  }
}
