import { type ILogger } from '@/shared/common/interfaces/logger.interface';
import {
  ResponderBuilder,
  ServerInterceptingCall,
  type ServerInterceptor,
  ServerListenerBuilder,
} from '@grpc/grpc-js';

export function createServerLoggingInterceptor(
  logger: ILogger,
): ServerInterceptor {
  return (methodDescriptor, call) => {
    logger.info(`Incoming gRPC call for method: ${methodDescriptor.path}`);
    const listener = new ServerListenerBuilder().build();
    const responder = new ResponderBuilder()
      .withStart((next) => {
        next(listener);
      })
      .withSendStatus((status, next) => {
        logger.info(
          `gRPC call for method '${methodDescriptor.path}' completed with status: ${JSON.stringify(status)}`,
        );
        next(status);
      })
      .build();
    return new ServerInterceptingCall(call, responder);
  };
}
