export class SharedConfigDITokens {
  //Configs
  static readonly GrpcPaymentServiceConfig: unique symbol = Symbol(
    'GrpcPaymentServiceConfig',
  );
  static readonly GrpcCourseServiceConfig: unique symbol = Symbol(
    'GrpcCourseServiceConfig',
  );
  static readonly GrpcUserServiceConfig: unique symbol = Symbol(
    'GrpcUserServiceConfig',
  );
  static readonly GrpcSessionServiceConfig: unique symbol = Symbol(
    'GrpcSessionServiceConfig',
  );
  static readonly MongooseConnectionConfig: unique symbol = Symbol(
    'MongooseConnectionConfig',
  );
  static readonly RabbitMQConnectionConfig: unique symbol = Symbol(
    'RabbitMQConnectionConfig',
  );
}
