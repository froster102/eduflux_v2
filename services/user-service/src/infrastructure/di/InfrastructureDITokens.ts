export class InfrastructureDITokens {
  //Kafka
  public static readonly KafkaEventBusConnection: unique symbol = Symbol(
    'KafkaEventBusConnection',
  );

  //Graphql Resolvers
  public static readonly UserResolvers: unique symbol = Symbol('UserResolvers');

  //Grpc controllers
  public static readonly GrpcUserServiceController: unique symbol = Symbol(
    'GrpcUserServiceController',
  );

  //Kafka consumers
  public static readonly KafkaEventsConsumer: unique symbol = Symbol(
    'KafkaEventsConsumer',
  );
}
