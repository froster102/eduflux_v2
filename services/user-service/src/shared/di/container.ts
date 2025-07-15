import { DatabaseClient } from '@/infrastructure/database/setup';
import { Container } from 'inversify';
import { TYPES } from './types';
import { UserMongoRepositoryImpl } from '@/infrastructure/database/repositories/user.repository';
import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/update-user.use-case';
import { UserEventsConsumer } from '@/interface/consumers/user-events.consumer';
import { GetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { UserRoutes } from '@/interface/routes/user.routes';
import { CloudinaryService } from '@/infrastructure/storage/cloudinary.service';
import { GetUploadUrlUseCase } from '@/application/use-cases/get-signed-url.use-case';
import { UserGrpcService } from '@/infrastructure/grpc/services/user.service';
import { GrpcServer } from '@/infrastructure/grpc/grpc.server';
import { GetInstructorProfileUseCase } from '@/application/use-cases/get-instructor-profile.use-case';

const container = new Container();

//database
container.bind(TYPES.DatabaseClient).to(DatabaseClient).inSingletonScope();

//Repositories
container.bind(TYPES.UserRepository).to(UserMongoRepositoryImpl);

//Use Cases
container.bind(TYPES.CreateUserUseCase).to(CreateUserUseCase);
container.bind(TYPES.UpdateUserUseCase).to(UpdateUserUseCase);
container.bind(TYPES.GetUserUseCase).to(GetUserUseCase);
container.bind(TYPES.GetUploadUrlUseCase).to(GetUploadUrlUseCase);
container
  .bind(TYPES.GetInstructorProfileUseCase)
  .to(GetInstructorProfileUseCase);

//Consumers
container.bind(TYPES.UserEventsConsumer).to(UserEventsConsumer);

//Http Routes
container.bind(TYPES.UserRoutes).to(UserRoutes);

//Services
container.bind(TYPES.FileStorageService).to(CloudinaryService);

//Grpc
container.bind(TYPES.UserGrpcService).to(UserGrpcService);
container.bind(TYPES.GrpcServer).to(GrpcServer);

export { container };
