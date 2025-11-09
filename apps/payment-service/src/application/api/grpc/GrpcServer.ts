import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { createServerLoggingInterceptor } from '@eduflux-v2/shared/adapters/grpc/interceptors/serverLoggingInterceptor';
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import { container } from '@application/di/RootModule';
import { GrpcServerConfig } from '@shared/config/GrpcServerConfig';
import type { GrpcPaymentServiceController } from '@application/api/grpc/controller/GrpcPaymentServiceController';
import { PaymentServiceService } from '@eduflux-v2/shared/adapters/grpc/generated/payment';
import { PaymentDITokens } from '@payment/di/PaymentDITokens';

export class GrpcServer {
  private logger = container
    .get<LoggerPort>(SharedCoreDITokens.Logger)
    .fromContext(GrpcServer.name);
  private server: Server;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.server = new Server({
      interceptors: [createServerLoggingInterceptor(this.logger)],
    });
    this.port = GrpcServerConfig.GRPC_SERVER_PORT;
  }

  public registerServices(): void {
    const paymentService = container.get<GrpcPaymentServiceController>(
      PaymentDITokens.GrpcPaymentServiceController,
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
        this.logger.info(`gRPC server listening on port ${port}`);
        this.registerServices();
      },
    );
  }
}
