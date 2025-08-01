import { InitiatePaymentUseCase } from '@/application/use-cases/initiate-payment.use-case';
import { Container } from 'inversify';
import { TYPES } from './types';
import { KafkaProducerAdapter } from '@/infrastructure/messaging/producer/kafka-producer.adapter';
import { StripeClient } from '@/infrastructure/stripe/stripe-client.gateway';
import { MongoPaymenRepositoryImpl } from '@/infrastructure/database/repositories/transaction.repository';
import { HandleStripeWebhookUseCase } from '@/application/use-cases/handle-stripe-webhook.use-case';
import { PaymentRoutes } from '@/interface/routes/payment.route';
import { TransactionMapper } from '@/infrastructure/mappers/transaction.mapper';
import { DatabaseClient } from '@/infrastructure/database/setup';
import { GrpcPaymentService } from '@/infrastructure/grpc/services/payment.service';
import { WinstonLogger } from '@/infrastructure/logging/winston.logger';

const container = new Container();

//Use Cases
container.bind(TYPES.InitiatePaymentUseCase).to(InitiatePaymentUseCase);
container.bind(TYPES.HandleStripeWebhookUseCase).to(HandleStripeWebhookUseCase);

//Repositories
container.bind(TYPES.PaymentRepository).to(MongoPaymenRepositoryImpl);

//Http routes
container.bind(TYPES.PaymentRoutes).to(PaymentRoutes);

//Ports
container.bind(TYPES.StripeGateway).to(StripeClient);

//Message broker
container
  .bind(TYPES.MessageBrokerGateway)
  .to(KafkaProducerAdapter)
  .inSingletonScope();

//Grpc service
container.bind(TYPES.GrpcPaymentService).to(GrpcPaymentService);

//Database
container.bind(TYPES.DatabaseClient).to(DatabaseClient);

//Mapper
container.bind(TYPES.PaymentMapper).to(TransactionMapper);

//Logger
container.bind(TYPES.Logger).to(WinstonLogger);

export { container };
