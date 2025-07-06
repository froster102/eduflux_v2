import { IUserGrpcService } from '@/interfaces/user-service.grpc.interface';
import { Container } from 'inversify';
import { TYPES } from './types';
import { UserGrpcServiceClient } from '@/grpc/client/user-service.grpc';

const container = new Container();

container
  .bind<IUserGrpcService>(TYPES.UserGrpcService)
  .to(UserGrpcServiceClient);

export { container };
