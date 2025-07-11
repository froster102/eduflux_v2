export const TYPES = {
  //Use case
  CreateEnrollmentUseCase: Symbol.for('CreateEnrollmentUseCase'),
  CompleteEnrollmentUseCase: Symbol.for('CompleteEnrollmentUseCase'),
  CheckUserEnrollmentUseCase: Symbol.for('CheckUserEnrollmentUseCase'),
  GetUserEnrollmentsUseCase: Symbol.for('GetUserEnrollmentsUseCase'),

  //Ports
  UserServiceGateway: Symbol.for('UserServiceGateway'),
  CourseServiceGateway: Symbol.for('CourseServiceGateway'),
  PaymentServiceGateway: Symbol.for('PaymentServiceGateway'),

  //Grpc service
  GrpcEnrollmentService: Symbol.for('GrpcEnrollmentService'),

  //Https routes
  EnrollmentRoutes: Symbol.for('EnrollmentRoutes'),

  //Consumers
  PaymentEventsConsumer: Symbol.for('PaymentEventsConsumer'),

  //Database
  DatabaseClient: Symbol.for('DatabaseClient'),

  //Repositories
  EnrollmentRepository: Symbol.for('EnrollmentRepository'),

  //Mappers
  EnrollmentMapper: Symbol.for('EnrollmentMapper'),
};
