export class SharedInfrastructureDITokens {
  static readonly MongooseConnection: unique symbol =
    Symbol('MongooseConnection');
  static readonly RabbitMQConnection: unique symbol =
    Symbol('RabbitMQConnection');
  static readonly UnitOfWork: unique symbol = Symbol('UnitOfWork');
}
