import type { ILogger } from '@/shared/common/interface/logger.interface';
import { injectable } from 'inversify';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { container } from '@/shared/di/container';
import { TYPES } from '@/shared/di/types';
import { grpcServerConfig } from '@/shared/config/server.grpc.config';
import { PaymentServiceService } from './generated/payment';
import { GrpcPaymentService } from './services/payment.service';
import { createServerLoggingInterceptor } from './interceptors/server-logging.interceptor';

@injectable()
export class GrpcServer {
  private logger = container
    .get<ILogger>(TYPES.Logger)
    .fromContext('GRPC_SERVER');
  private server: Server;
  private port: number;

  constructor() {
    this.server = new Server({
      interceptors: [createServerLoggingInterceptor(this.logger)],
    });
    this.port = Number(grpcServerConfig.PORT);
  }

  public registerServices(): void {
    const paymentService = container.get<GrpcPaymentService>(
      TYPES.GrpcPaymentService,
    );
    this.server.addService(PaymentServiceService, paymentService);
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
