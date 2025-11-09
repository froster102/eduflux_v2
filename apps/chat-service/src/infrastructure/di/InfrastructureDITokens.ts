export class InfrastructureDITokens {
  static readonly MongooseConnection: unique symbol =
    Symbol('MongooseConnection');
  static readonly RabbitMQConnection: unique symbol =
    Symbol('RabbitMQConnection');

  static readonly MongooseConfig: unique symbol = Symbol('MongooseConfig');
  static readonly RabbitMQConfig: unique symbol = Symbol('RabbitMQConfig');
}
