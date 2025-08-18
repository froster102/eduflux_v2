import { type ILogger } from '@/shared/common/interfaces/logger.interface';
import {
  InterceptingCall,
  ListenerBuilder,
  RequesterBuilder,
  type Interceptor,
} from '@grpc/grpc-js';

export function createClientLoggingInterceptor(logger: ILogger): Interceptor {
  return (options, nextCall) => {
    const next = nextCall(options);

    const requester = new RequesterBuilder()
      .withStart((metadata, listener, nextStart) => {
        const customListener = new ListenerBuilder()
          .withOnReceiveStatus((status, nextStatus) => {
            logger.info(
              `gRPC call for method '${options.method_definition.path}' completed with status: ${JSON.stringify(status)}`,
            );
            nextStatus(status);
          })
          .build();
        nextStart(metadata, customListener);
      })
      .withSendMessage((message, nextMessage) => {
        logger.info(
          `gRPC request started for method: ${options.method_definition.path}`,
        );
        nextMessage(message);
      })
      .build();

    return new InterceptingCall(next, requester);
  };
}
