import { injectable } from 'inversify';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { UserServiceService } from './generated/user';
import { container } from '@/shared/di/container';
import { UserGrpcService } from './services/user.service';
import { Logger } from '@/shared/utils/logger';
import { TYPES } from '@/shared/di/types';
import { grpcServerConfig } from '@/shared/config/server.grpc.config';

@injectable()
export class GrpcServer {
  private logger = new Logger('USER_SERVICE');
  private server: Server;
  private port: number;

  constructor() {
    this.server = new Server();
    this.port = Number(grpcServerConfig.PORT);
  }

  public registerServices(): void {
    const userService = container.get<UserGrpcService>(TYPES.UserGrpcService);
    this.server.addService(UserServiceService, userService);
  }

  public start(): void {
    this.server.bindAsync(
      `0.0.0.0:${this.port}`,
      ServerCredentials.createInsecure(),
      (error: Error | null, port: number) => {
        if (error) {
          console.error(`Failed to bind server: ${error.message}`);
          return;
        }
        this.logger.info(`gRPC server running on port ${port}`);
        this.registerServices();
      },
    );
  }
}
