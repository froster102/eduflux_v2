import { Container } from 'inversify';
import { TYPES } from './types';
import { NodeMailerService } from '@/infrastructure/services/nodemailer.service';
import { IEventPublisher } from '@/domain/services/event-publisher.service';
import { KafkaEventPublisher } from '@/infrastructure/messaging/kafka/producer/kafka-event.publisher';
import { IEmailService } from '@/application/ports/email.service';

const container = new Container();

//Services
container
  .bind<IEmailService>(TYPES.EmailService)
  .to(NodeMailerService)
  .inSingletonScope();

//publishers
container
  .bind<IEventPublisher>(TYPES.EventPublisher)
  .to(KafkaEventPublisher)
  .inSingletonScope();

export { container };
