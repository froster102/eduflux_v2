import { credentials, type ServiceError } from '@grpc/grpc-js';
import { CoreDITokens } from '@shared/common/di/CoreDITokens';
import type { LoggerPort } from '@shared/common/port/logger/LoggerPort';
import { inject } from 'inversify';
import type { ISessionService } from '@payment/interface/ISessionService';
import { SessionServiceClient } from '@application/api/grpc/generated/session';
import type { Session } from '@shared/types/Session';
import { GrpcCourseService } from '@application/api/grpc/client/GrpcCourseService';
import { GrpcSessionServiceConfig } from '@shared/config/GrpcSessionServiceConfig';

export class GrpcSessionService implements ISessionService {
  private client: SessionServiceClient;
  private address: string;

  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
  ) {
    this.logger = logger.fromContext(GrpcCourseService.name);
    this.address = GrpcSessionServiceConfig.GRPC_SESSION_SERVICE_URL;
    this.client = new SessionServiceClient(
      this.address,
      credentials.createInsecure(),
    );
    this.logger.info(
      `gRPC session service client initialized, target:${this.address}`,
    );
  }

  getSession(sessionId: string): Promise<Session> {
    return new Promise((resolve, reject) => {
      this.client.getSession(
        { id: sessionId },
        (error: ServiceError | null, response) => {
          if (error) {
            this.logger.error(
              `Error fetching session details ${error.message}`,
            );
            reject(new Error(error.message));
          }
          if (response) {
            resolve({ _class: 'session', ...response });
          }
        },
      );
    });
  }
}
