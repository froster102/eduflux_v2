import { grpcUserServiceConfig } from '@/shared/config/grpcUserServiceConfig';
import { logger } from '@/shared/utils/logger';
import { GrpcUserServiceAdapter } from '@eduflux-v2/shared/adapters/grpc/GrpcUserServiceAdapter';
import type { UserServicePort } from '@eduflux-v2/shared/ports/gateway/UserServicePort';

export const userService: UserServicePort = new GrpcUserServiceAdapter(
  logger,
  grpcUserServiceConfig,
);
