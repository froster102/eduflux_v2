import { IEnrollmentRepository } from '@/domain/repositories/enrollment.repository';
import { Container } from 'inversify';
import { TYPES } from './types';
import { EnrollmentRepository } from '@/infrastructure/database/repositories/enrollment.repository';
import { IMapper } from '@/infrastructure/mapper/interface/mapper.interface';
import { Enrollment } from '@/domain/enitites/enrollment.entity';
import { IEnrollment } from '@/infrastructure/database/schema/enrollment.schema';
import { EnrollmentMapper } from '@/infrastructure/mapper/enrollment.mapper';
import { IUserServiceGateway } from '@/application/ports/user-service.gateway';
import { GrpcUserServiceClient } from '@/infrastructure/grpc/client/user-service-client.grpc';
import { ICourseServiceGateway } from '@/application/ports/course-service.gateway';
import { GrpcCourseServiceClient } from '@/infrastructure/grpc/client/course-service-client.grpc';
import { EnrollmentRoutes } from '@/interface/routes/enrollment.routes';
import { CreateEnrollmentUseCase } from '@/application/use-cases/create-enrollment.use-case';
import { IPaymentServiceGateway } from '@/application/ports/payment-service.gateway';
import { GrpcPaymentServiceClient } from '@/infrastructure/grpc/client/payment-service.grpc';
import { DatabaseClient } from '@/infrastructure/database/setup';
import { PaymentEventsConsumer } from '@/interface/consumer/payment-events.consumer';
import { CompleteEnrollmentUseCase } from '@/application/use-cases/complete-enrollment.use-case';
import { GrpcEnrollmentService } from '@/infrastructure/grpc/services/enrollment.grpc.service';
import { GetUserEnrollmentsUseCase } from '@/application/use-cases/get-user-enrollments.use-case';
import { CheckUserEnrollmentUseCase } from '@/application/use-cases/check-user-enrollment.use-case';

const container = new Container();

//Use case
container
  .bind<CreateEnrollmentUseCase>(TYPES.CreateEnrollmentUseCase)
  .to(CreateEnrollmentUseCase);
container
  .bind<CompleteEnrollmentUseCase>(TYPES.CompleteEnrollmentUseCase)
  .to(CompleteEnrollmentUseCase);
container
  .bind<GetUserEnrollmentsUseCase>(TYPES.GetUserEnrollmentsUseCase)
  .to(GetUserEnrollmentsUseCase);
container
  .bind<CheckUserEnrollmentUseCase>(TYPES.CheckUserEnrollmentUseCase)
  .to(CheckUserEnrollmentUseCase);

//Ports
container
  .bind<IUserServiceGateway>(TYPES.UserServiceGateway)
  .to(GrpcUserServiceClient);
container
  .bind<ICourseServiceGateway>(TYPES.CourseServiceGateway)
  .to(GrpcCourseServiceClient);
container
  .bind<IPaymentServiceGateway>(TYPES.PaymentServiceGateway)
  .to(GrpcPaymentServiceClient);

//Repositories
container
  .bind<IEnrollmentRepository>(TYPES.EnrollmentRepository)
  .to(EnrollmentRepository);

//Http routes
container.bind<EnrollmentRoutes>(TYPES.EnrollmentRoutes).to(EnrollmentRoutes);

//Grpc services
container
  .bind<GrpcEnrollmentService>(TYPES.GrpcEnrollmentService)
  .to(GrpcEnrollmentService);

//Consumers
container
  .bind<PaymentEventsConsumer>(TYPES.PaymentEventsConsumer)
  .to(PaymentEventsConsumer);

//Mapper
container
  .bind<IMapper<Enrollment, IEnrollment>>(TYPES.EnrollmentMapper)
  .to(EnrollmentMapper);

//Database
container.bind<DatabaseClient>(TYPES.DatabaseClient).to(DatabaseClient);

export { container };
