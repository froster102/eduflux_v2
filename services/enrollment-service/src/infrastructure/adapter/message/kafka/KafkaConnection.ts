import { CoreDITokens } from '@core/common/di/CoreDITokens';
import type { LoggerPort } from '@core/common/port/logger/LoggerPort';
import { KafkaLoggerAdapter } from '@infrastructure/adapter/message/kafka/KafkaLoggerAdapter';
import { KafkaConfig } from '@shared/config/KafkaConfig';
import { tryCatch } from '@shared/utils/try-catch';
import { inject } from 'inversify';
import { Kafka, type Consumer, type Producer } from 'kafkajs';

export class KafkaEventBusConnection {
  private kafka: Kafka;
  clientId = KafkaConfig.CLIENT_ID;
  brokers = KafkaConfig.BROKERS;
  connectionTimeout = 3000;
  requestTimeout = 25000;
  private producer: Producer;

  constructor(
    @inject(CoreDITokens.Logger) private readonly logger: LoggerPort,
  ) {
    this.logger = logger.fromContext('KAFKA_JS');
    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
      connectionTimeout: this.connectionTimeout,
      requestTimeout: this.requestTimeout,
      logCreator: KafkaLoggerAdapter.new(),
    });
    this.producer = this.kafka.producer();
  }

  getProducer(): Producer {
    return this.producer;
  }

  getConsumer(consumerGroupId: string): Consumer {
    return this.kafka.consumer({ groupId: consumerGroupId });
  }

  async connectProducer(): Promise<void> {
    const { error } = await tryCatch(this.producer.connect());
    if (error) {
      this.logger.error(
        `Failed to connect to Kafka producer: ${error.message}`,
      );
      throw new Error(error.message);
    }
    this.logger.info(`Established connection to Kafka producer.`);
  }

  async disconnectProducer(): Promise<void> {
    const { error } = await tryCatch(this.producer.disconnect());
    if (error) {
      this.logger.error(
        `Failed to disconnect Kafka producer: ${error.message}`,
      );
    } else {
      this.logger.info('Kafka producer disconnected gracefully.');
    }
  }
}
