import { KafkaLoggerAdapter } from '@infrastructure/adapter/messaging/kafka/KafkaLoggerAdapter';
import { KafkaConfig } from '@shared/config/KafkaConfig';
import { Kafka, type Consumer, type Producer } from 'kafkajs';

export class KafkaConnection {
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: KafkaConfig.CLIENT_ID,
      brokers: KafkaConfig.BROKERS,
      connectionTimeout: 3000,
      requestTimeout: 25000,
      logCreator: KafkaLoggerAdapter.new(),
    });
  }

  public getProducer(): Producer {
    return this.kafka.producer();
  }

  public getConsumer(consumerGroupId: string): Consumer {
    return this.kafka.consumer({
      groupId: consumerGroupId,
    });
  }
}
