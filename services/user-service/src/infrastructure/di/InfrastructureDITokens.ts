export class InfrastructureDITokens {
  //Kafka
  public static readonly KafkaConnection: unique symbol =
    Symbol('KafkaConnection');

  //Grpc controllers
  public static readonly GrpcUserServiceController: unique symbol = Symbol(
    'GrpcUserServiceController',
  );

  //Kafka consumers
  public static readonly KafkaEventsConsumer: unique symbol = Symbol(
    'KafkaEventsConsumer',
  );
}
