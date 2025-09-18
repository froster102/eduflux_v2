export class InfrastructureDITokens {
  static readonly KafkaConnection: unique symbol = Symbol(
    'KafkaEventBusConnection',
  );
  static readonly KafkaEventsConsumer: unique symbol = Symbol(
    'KafkaEventsConsumer',
  );

  //Cron services
  static readonly CronServices: unique symbol = Symbol('CronServices');

  //GrahqlResolver
  static readonly SessionResolver: unique symbol = Symbol('SessionResolver');
}
