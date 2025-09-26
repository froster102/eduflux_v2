export class InfrastructureDITokens {
  //Kafka
  public static readonly KafkaEventBusConnection: unique symbol = Symbol(
    'KafkaEventBusConnection',
  );

  //Grpc controllers
  public static readonly GrpcUserServiceController: unique symbol = Symbol(
    'GrpcUserServiceController',
  );

  //Kafka consumers
  public static readonly KafkaEventsConsumer: unique symbol = Symbol(
    'KafkaEventsConsumer',
  );
}
