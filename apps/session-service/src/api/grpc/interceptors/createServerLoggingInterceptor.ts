import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import {
  ResponderBuilder,
  ServerInterceptingCall,
  type ServerInterceptor,
  ServerListenerBuilder,
} from '@grpc/grpc-js';

export function createServerLoggingInterceptor(
  logger: LoggerPort,
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
