import { CoreDITokens } from "@core/common/di/CoreDITokens";
import type { LoggerPort } from "@core/common/port/logger/LoggerPort";
import type { EventBusPort } from "@core/common/port/message/EventBusPort";
import type { KafkaConnection } from "@infrastructure/adapter/kafka/KafkaConnection";
import { InfrastructureDITokens } from "@infrastructure/di/InfrastructureDITokens";
import { CHAT_TOPIC } from "@shared/constants/topics";
import { tryCatch } from "@shared/utils/try-catch";
import { inject } from "inversify";
import type { Producer } from "kafkajs";

export class KafkaEventBusProducerAdapter implements EventBusPort {
  private readonly producer: Producer;
  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
    @inject(InfrastructureDITokens.KafkaConnection)
    private readonly kafkaConnection: KafkaConnection,
  ) {
    this.logger = logger.fromContext(KafkaEventBusProducerAdapter.name);

    this.producer = this.kafkaConnection.getProducer();
    this.producer.on("producer.connect", () => {
      this.logger.debug("Connected to kafka producer");
    });
    this.producer.on("producer.disconnect", () => {
      this.logger.debug("Disconnected from kafka producer");
    });
  }

  async connect() {
    const producer = this.producer;
    const { error } = await tryCatch(producer.connect());
    if (error) {
      this.logger.error(
        `Failed to connect to kafka producer error${error?.message} `,
        error as Record<string, any>,
      );
      process.exit(1);
    }
  }

  async sendEvent<TEvent extends { type: string; entityId: string }>(
    event: TEvent,
  ): Promise<void> {
    const messageValue = JSON.stringify(event);
    let topic: string;
    switch (event.type) {
      case "user.chat.created": {
        topic = CHAT_TOPIC;
        break;
      }
      default: {
        this.logger.warn(
          `Event not sent as not topic was defined event name:${event.type}`,
        );

        return;
      }
    }

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: event.entityId,
            value: messageValue,
            headers: {
              //attach correlation id from async store
              "x-correlation-id": "",
            },
          },
        ],
      });
      this.logger.info(`Sent message ${messageValue} to ${topic}`);
    } catch (error) {
      const errorMessage = (error as Error)?.message;
      this.logger.error(
        `Failed to publish message to Kafka producer: ${errorMessage}`,
      );
    }
  }
}
