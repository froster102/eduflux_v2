import { InitiatePaymentUseCase } from '@/application/use-cases/initiate-payment.use-case';
import { Container } from 'inversify';
import { TYPES } from './types';
import { IPaymentRepository } from '@/domain/repositories/transaction.repository';
import { IMessageBrokerGatway } from '@/application/ports/message-broker.gateway';
import { KafkaProducerAdapter } from '@/infrastructure/messaging/producer/kafka-producer.adapter';
import { IStripeGateway } from '@/application/ports/stripe.gateway';
import { StripeClient } from '@/infrastructure/stripe/stripe-client.gateway';
import { MongoPaymenRepositoryImpl } from '@/infrastructure/database/repositories/transaction.repository';
import { HandleStripeWebhookUseCase } from '@/application/use-cases/handle-stripe-webhook.use-case';
import { PaymentRoutes } from '@/interface/routes/payment.route';
import { TransactionMapper } from '@/infrastructure/mappers/transaction.mapper';
import { DatabaseClient } from '@/infrastructure/database/setup';
import { GrpcPaymentService } from '@/infrastructure/grpc/services/payment.service';

const container = new Container();

//Use Cases
container
  .bind<InitiatePaymentUseCase>(TYPES.InitiatePaymentUseCase)
  .to(InitiatePaymentUseCase);
container
  .bind<HandleStripeWebhookUseCase>(TYPES.HandleStripeWebhookUseCase)
  .to(HandleStripeWebhookUseCase);

//Repositories
container
  .bind<IPaymentRepository>(TYPES.PaymentRepository)
  .to(MongoPaymenRepositoryImpl);

//Http routes
container.bind<PaymentRoutes>(TYPES.PaymentRoutes).to(PaymentRoutes);

//Ports
container.bind<IStripeGateway>(TYPES.StripeGateway).to(StripeClient);

//Message broker
container
  .bind<IMessageBrokerGatway>(TYPES.MessageBrokerGateway)
  .to(KafkaProducerAdapter)
  .inSingletonScope();

//Grpc service
container
  .bind<GrpcPaymentService>(TYPES.GrpcPaymentService)
  .to(GrpcPaymentService);

//Database
container.bind<DatabaseClient>(TYPES.DatabaseClient).to(DatabaseClient);

//Mapper
container.bind<TransactionMapper>(TYPES.PaymentMapper).to(TransactionMapper);

export { container };
