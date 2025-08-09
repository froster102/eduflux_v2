import type { ILogger } from '@/shared/common/interface/logger.interface';
import { injectable } from 'inversify';
import {
  ResponderBuilder,
  Server,
  ServerCredentials,
  ServerInterceptingCall,
  ServerInterceptor,
  ServerListenerBuilder,
} from '@grpc/grpc-js';
import { UserServiceService } from './generated/user';
import { container } from '@/shared/di/container';
import { UserGrpcService } from './services/user.service';
import { TYPES } from '@/shared/di/types';
import { grpcServerConfig } from '@/shared/config/server.grpc.config';

@injectable()
export class GrpcServer {
  private logger = container
    .get<ILogger>(TYPES.Logger)
    .fromContext('GRPC_SERVER');
  private server: Server;
  private port: number;

  constructor() {
    this.server = new Server({ interceptors: [this.loggingInterceptor] });
    this.port = Number(grpcServerConfig.PORT);
  }

  public registerServices(): void {
    const userService = container.get<UserGrpcService>(TYPES.UserGrpcService);
    this.server.addService(UserServiceService, userService);
  }

  loggingInterceptor: ServerInterceptor = (methodDescriptor, call) => {
    const listener = new ServerListenerBuilder()
      .withOnReceiveMessage((message, next) => {
        this.logger.info(`Receive a message ${JSON.stringify(message)}`);
        next(message);
      })
      .build();
    const responder = new ResponderBuilder()
      .withStart((next) => {
        next(listener);
      })
      .withSendMessage((message, next) => {
        this.logger.info(`Send a message ${JSON.stringify(message)}`);
        next(message);
      })
      .build();
    return new ServerInterceptingCall(call, responder);
  };

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
