export const TYPES = {
  //Database
  DatabaseClient: Symbol.for('DatabaseClient'),

  //Repositories
  UserRepository: Symbol.for('UserRepository'),
  ProgressRepository: Symbol.for('ProgressRepository'),

  //Use Cases
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  GetUserUseCase: Symbol.for('GetUserUseCase'),
  GetUploadUrlUseCase: Symbol.for('GetUploadUrlUseCase'),
  GetInstructorProfileUseCase: Symbol.for('GetInstructorProfileUseCase'),
  GetUserCourseProgressUseCase: Symbol.for('GetUserCourseProgressUseCase'),
  CreateUserProgressUseCase: Symbol.for('CreateUserProgressUseCase'),
  AddLectureProgressUseCase: Symbol.for('AddLectureProgressUseCase'),
  DeleteLectureProgressUseCase: Symbol.for('DeleteLectureProgressUseCase'),
  GetInstructorsUseCase: Symbol.for('GetInstructorsUseCase'),
  GetUsersUseCase: Symbol.for('GetUsersUseCase'),

  //Ports
  MessageBrokerGateway: Symbol.for('MessageBrokerGateway'),

  //Consumers
  UserEventsConsumer: Symbol.for('UserEventsConsumer'),
  EnrollmentEventsConsumer: Symbol.for('EnrollmentEventsConsumer'),

  //Http Controllers
  UserController: Symbol.for('UserController'),

  //Http Routes
  UserRoutes: Symbol.for('UserRoutes'),
  ProgressRoutes: Symbol.for('ProgressRoutes'),

  //Services
  FileStorageService: Symbol.for('FileStorageService'),

  //Grpc Services
  UserGrpcService: Symbol.for('UserGrpcService'),
  GrpcServer: Symbol.for('GrpcServer'),

  //Mappers
  ProgressMapper: Symbol.for('ProgressMapper'),
  UserMapper: Symbol.for('UserMapper'),

  //Logger
  Logger: Symbol.for('Logger'),

  //Resolvers
  UserResolver: Symbol.for('GraphqlResolver'),
};
