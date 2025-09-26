export class InfrastructureDITokens {
  static readonly KafkaConnection: unique symbol = Symbol(
    "KafkaEventBusConnection",
  );
  static readonly KafkaEventsConsumer: unique symbol = Symbol(
    "KafkaEventsConsumer",
  );
}
