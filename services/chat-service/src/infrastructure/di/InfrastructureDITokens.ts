export class InfrastructureDITokens {
  static readonly KafkaConnection: unique symbol = Symbol("KafkaConnection");

  //Kafka consumer
  static readonly KafkaEventsConsumer: unique symbol = Symbol(
    "KafkaEventsConsumer",
  );
}
