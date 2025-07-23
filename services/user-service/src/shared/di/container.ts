import { DatabaseClient } from '@/infrastructure/database/setup';
import { Container } from 'inversify';
import { TYPES } from './types';
import { UserMongoRepositoryImpl } from '@/infrastructure/database/repositories/user.repository';
import { CreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/update-user.use-case';
// import { UserEventsConsumer } from '@/interface/consumers/user-events.consumer';
import { GetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { UserRoutes } from '@/interface/routes/user.routes';
import { UserGrpcService } from '@/infrastructure/grpc/services/user.service';
import { GrpcServer } from '@/infrastructure/grpc/grpc.server';
import { GetInstructorProfileUseCase } from '@/application/use-cases/get-instructor-profile.use-case';
import { AddLectureProgressUseCase } from '@/application/use-cases/add-lecture-progress.use-case';
import { DeleteLectureProgressUseCase } from '@/application/use-cases/delete-lecture-progress.use-case';
import { ProgressRoutes } from '@/interface/routes/progress.routes';
import { MongoProgressRepository } from '@/infrastructure/database/repositories/progress.respository';
import { ProgressMapper } from '@/infrastructure/mappers/progress.mapper';
import { GetUserCourseProgressUseCase } from '@/application/use-cases/get-user-course-progress.use-case';
import { EnrollmentEventsConsumer } from '@/interface/consumers/enrollment-events.consumer';
import { CreateUserProgressUseCase } from '@/application/use-cases/create-user-progress.use-case';
import { KafkaProducerAdapter } from '@/infrastructure/messaging/producer/kafka-producer.adapter';
import { GetUserSessionPriceUseCase } from '@/application/use-cases/get-user-session-price.use-case';
import { UpdateUserSessionPriceUseCase } from '@/application/use-cases/update-user-session-price.use-case';

const container = new Container();

//database
container.bind(TYPES.DatabaseClient).to(DatabaseClient).inSingletonScope();

//Repositories
container.bind(TYPES.UserRepository).to(UserMongoRepositoryImpl);
container.bind(TYPES.ProgressRepository).to(MongoProgressRepository);

//Use Cases
container.bind(TYPES.CreateUserUseCase).to(CreateUserUseCase);
container.bind(TYPES.UpdateUserUseCase).to(UpdateUserUseCase);
container.bind(TYPES.GetUserUseCase).to(GetUserUseCase);
container.bind(TYPES.CreateUserProgressUseCase).to(CreateUserProgressUseCase);
container.bind(TYPES.GetUserSessionPriceUseCase).to(GetUserSessionPriceUseCase);
container
  .bind(TYPES.UpdateUserSessionPriceUseCase)
  .to(UpdateUserSessionPriceUseCase);
container
  .bind(TYPES.GetInstructorProfileUseCase)
  .to(GetInstructorProfileUseCase);
container.bind(TYPES.AddLectureProgressUseCase).to(AddLectureProgressUseCase);
container
  .bind(TYPES.DeleteLectureProgressUseCase)
  .to(DeleteLectureProgressUseCase);
container
  .bind(TYPES.GetUserCourseProgressUseCase)
  .to(GetUserCourseProgressUseCase);

//Ports
container
  .bind(TYPES.MessageBrokerGateway)
  .to(KafkaProducerAdapter)
  .inSingletonScope();

// container.bind(TYPES.UserEventsConsumer).to(UserEventsConsumer);
container.bind(TYPES.EnrollmentEventsConsumer).to(EnrollmentEventsConsumer);

//Http Routes
container.bind(TYPES.UserRoutes).to(UserRoutes);
container.bind(TYPES.ProgressRoutes).to(ProgressRoutes);

//Services

//Grpc
container.bind(TYPES.UserGrpcService).to(UserGrpcService);
container.bind(TYPES.GrpcServer).to(GrpcServer);

//Mapper
container.bind(TYPES.ProgressMapper).to(ProgressMapper);

export { container };
