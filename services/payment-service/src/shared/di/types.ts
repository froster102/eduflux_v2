export const TYPES = {
  //Use Cases
  InitiatePaymentUseCase: Symbol.for('InitiatePaymentUseCase'),
  HandleStripeWebhookUseCase: Symbol.for('HandleStripeWebhookUseCase'),

  //Repositories
  PaymentRepository: Symbol.for('PaymentRepository'),

  //Http routes
  PaymentRoutes: Symbol.for('PaymentRoutes'),

  //Ports
  StripeGateway: Symbol.for('PaymentGateway'),
  MessageBrokerGateway: Symbol.for('MessageBrokerGateway'),

  //Database
  DatabaseClient: Symbol.for('DatabaseClient'),

  //Grpc Services
  GrpcPaymentService: Symbol.for('GrpcPaymentService'),

  //mappers
  PaymentMapper: Symbol.for('PaymentMapper'),
};
