export class InfrastructureDITokens {
  static readonly KafkaEventBusConnection: unique symbol = Symbol(
    'KafkaEventBusConnection',
  );
  static readonly KafkaEventsConsumer: unique symbol = Symbol(
    'KafkaEventsConsumer',
  );
  static readonly GrpcEnrollmentServiceController: unique symbol = Symbol(
    'GrpcEnrollmentServiceController',
  );
}
