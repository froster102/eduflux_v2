import { Container } from 'inversify';
import { TYPES } from './types';
import { EnrollmentRepository } from '@/infrastructure/database/repositories/enrollment.repository';
import { EnrollmentMapper } from '@/infrastructure/mapper/enrollment.mapper';
import { GrpcUserServiceClient } from '@/infrastructure/grpc/client/user-service-client.grpc';
import { GrpcCourseServiceClient } from '@/infrastructure/grpc/client/course-service-client.grpc';
import { EnrollmentRoutes } from '@/interface/routes/enrollment.routes';
import { CreateEnrollmentUseCase } from '@/application/use-cases/create-enrollment.use-case';
import { GrpcPaymentServiceClient } from '@/infrastructure/grpc/client/payment-service.grpc';
import { DatabaseClient } from '@/infrastructure/database/setup';
import { PaymentEventsConsumer } from '@/interface/consumer/payment-events.consumer';
import { CompleteEnrollmentUseCase } from '@/application/use-cases/complete-enrollment.use-case';
import { GrpcEnrollmentService } from '@/infrastructure/grpc/services/enrollment.grpc.service';
import { GetUserEnrollmentsUseCase } from '@/application/use-cases/get-user-enrollments.use-case';
import { KafkaProducerAdapter } from '@/infrastructure/messaging/producer/kafka-producer.adapter';
import { CheckUserEnrollmentUseCase } from '@/application/use-cases/check-user-enrollment.use-case';

const container = new Container();

//Use case
container.bind(TYPES.CreateEnrollmentUseCase).to(CreateEnrollmentUseCase);
container.bind(TYPES.CompleteEnrollmentUseCase).to(CompleteEnrollmentUseCase);
container.bind(TYPES.GetUserEnrollmentsUseCase).to(GetUserEnrollmentsUseCase);
container.bind(TYPES.CheckUserEnrollmentUseCase).to(CheckUserEnrollmentUseCase);

//Ports
container.bind(TYPES.UserServiceGateway).to(GrpcUserServiceClient);
container.bind(TYPES.CourseServiceGateway).to(GrpcCourseServiceClient);
container.bind(TYPES.PaymentServiceGateway).to(GrpcPaymentServiceClient);
container
  .bind(TYPES.MessageBrokerGateway)
  .to(KafkaProducerAdapter)
  .inSingletonScope();

//Repositories
container.bind(TYPES.EnrollmentRepository).to(EnrollmentRepository);

//Http routes
container.bind(TYPES.EnrollmentRoutes).to(EnrollmentRoutes);

//Grpc services
container.bind(TYPES.GrpcEnrollmentService).to(GrpcEnrollmentService);

//Consumers
container.bind(TYPES.PaymentEventsConsumer).to(PaymentEventsConsumer);

//Mapper
container.bind(TYPES.EnrollmentMapper).to(EnrollmentMapper);

//Database
container.bind(TYPES.DatabaseClient).to(DatabaseClient);

export { container };
