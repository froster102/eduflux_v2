import { DatabaseClient } from '@/infrastructure/database/setup';
import { Container } from 'inversify';
import { TYPES } from './types';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { UserMongoRepositoryImpl } from '@/infrastructure/database/repositories/user.repository';
import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/update-user.use-case';
import { UserEventsConsumer } from '@/interface/consumers/user-events.consumer';
import { GetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { UserRoutes } from '@/interface/routes/user.routes';
import { IFileStorageService } from '@/application/ports/file-storage.service';
import { CloudinaryService } from '@/infrastructure/storage/cloudinary.service';
import { GetUploadUrlUseCase } from '@/application/use-cases/get-signed-url.use-case';
import { UserGrpcService } from '@/infrastructure/grpc/services/user.service';
import { GrpcServer } from '@/infrastructure/grpc/grpc.server';
import { GetInstructorProfileUseCase } from '@/application/use-cases/get-instructor-profile.use-case';

const container = new Container();

//database
container
  .bind<DatabaseClient>(TYPES.DatabaseClient)
  .to(DatabaseClient)
  .inSingletonScope();

//Repositories
container
  .bind<IUserRepository>(TYPES.UserRepository)
  .to(UserMongoRepositoryImpl);

//Use Cases
container
  .bind<CreateUserUseCase>(TYPES.CreateUserUseCase)
  .to(CreateUserUseCase);
container
  .bind<UpdateUserUseCase>(TYPES.UpdateUserUseCase)
  .to(UpdateUserUseCase);
container.bind<GetUserUseCase>(TYPES.GetUserUseCase).to(GetUserUseCase);
container
  .bind<GetUploadUrlUseCase>(TYPES.GetUploadUrlUseCase)
  .to(GetUploadUrlUseCase);
container
  .bind<GetInstructorProfileUseCase>(TYPES.GetInstructorProfileUseCase)
  .to(GetInstructorProfileUseCase);

//Consumers
container
  .bind<UserEventsConsumer>(TYPES.UserEventsConsumer)
  .to(UserEventsConsumer);

//Http Routes
container.bind<UserRoutes>(TYPES.UserRoutes).to(UserRoutes);

//Services
container
  .bind<IFileStorageService>(TYPES.FileStorageService)
  .to(CloudinaryService);

//Grpc
container.bind<UserGrpcService>(TYPES.UserGrpcService).to(UserGrpcService);
container.bind<GrpcServer>(TYPES.GrpcServer).to(GrpcServer);

export { container };
