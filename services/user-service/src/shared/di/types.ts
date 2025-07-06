export const TYPES = {
  //Database
  DatabaseClient: Symbol.for('DatabaseClient'),

  //Repositories
  UserRepository: Symbol.for('UserRepository'),

  //Use Cases
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  GetUserUseCase: Symbol.for('GetUserUseCase'),
  GetUploadUrlUseCase: Symbol.for('GetUploadUrlUseCase'),
  GetInstructorProfileUseCase: Symbol.for('GetInstructorProfileUseCase'),

  //Consumers
  UserEventsConsumer: Symbol.for('UserEventsConsumer'),

  //Http Controllers
  UserController: Symbol.for('UserController'),

  //Http Routes
  UserRoutes: Symbol.for('UserRoutes'),

  //Services
  FileStorageService: Symbol.for('FileStorageService'),

  //Grpc Services
  UserGrpcService: Symbol.for('UserGrpcService'),
  GrpcServer: Symbol.for('GrpcServer'),
};
