import { HttpServer } from '@api/http/HttpServer';
import { HttpServerConfig } from '@shared/config/HttpServerConfig';
import { CheckoutServiceEventSubscribers } from '@infrastructure/event/CheckoutServiceEventSubscribers';
import type { RabbitMqConnection } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConnection';
import { RabbitMQqueueFormatter } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQqueueFormatter';
import { RabbitMQConfigurer } from '@eduflux-v2/shared/infrastructure/messaging/rabbitmq/RabbitMQConfigurer';
import { SharedCoreDITokens } from '@eduflux-v2/shared/di/SharedCoreDITokens';
import type { LoggerPort } from '@eduflux-v2/shared/ports/logger/LoggerPort';
import { container } from '@di/RootModule';
import type { MessageBrokerPort } from '@eduflux-v2/shared/ports/message/MessageBrokerPort';
import { SharedInfrastructureDITokens } from '@eduflux-v2/shared/di/SharedInfrastructureDITokens';

export class CheckoutService {
  private httpServer?: HttpServer;

  async start(): Promise<void> {
    this.httpServer = new HttpServer(HttpServerConfig.PORT);
    await this.configureMessagaseBroker();
    this.httpServer.start();
  }

  private async configureMessagaseBroker(): Promise<void> {
    const rabbitMqConnection = container.get<RabbitMqConnection>(
      SharedInfrastructureDITokens.RabbitMQConnection,
    );

    const rabbitMQConfigurer = new RabbitMQConfigurer(
      rabbitMqConnection,
      new RabbitMQqueueFormatter('checkout-service'),
      3,
      container.get<LoggerPort>(SharedCoreDITokens.Logger),
    );

    const subscribers = CheckoutServiceEventSubscribers.from(container);

    await rabbitMqConnection.connect();
    await rabbitMQConfigurer.configure({
      exchange: { name: 'application-events', type: 'topic' },
      subscribers: subscribers.items,
    });
    const messageBroker = container.get<MessageBrokerPort>(
      SharedCoreDITokens.MessageBroker,
    );
    await messageBroker.addSubscribers(subscribers);
  }
}
