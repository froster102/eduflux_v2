export class InfrastructureDITokens {
  static readonly KafkaConnection: unique symbol = Symbol(
    'KafkaEventBusConnection',
  );
  static readonly KafkaEventsConsumer: unique symbol = Symbol(
    'KafkaEventsConsumer',
  );

  //Webhook handler
  static readonly LiveKitWebhookHandler: unique symbol = Symbol(
    'LiveKitWebhookHandler',
  );

  //Cron services
  static readonly CronServices: unique symbol = Symbol('CronServices');
}
