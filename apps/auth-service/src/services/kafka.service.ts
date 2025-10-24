import { kafkaProducer } from '@/messaging/kafka/kafka';
import { AUTH_SERVICE } from '@/shared/constants/services';
import { type IEventPayload } from '@/shared/interfaces/event.interface';
import { Logger } from '@/shared/utils/logger';
import { tryCatch } from '@/shared/utils/try-catch';

const logger = new Logger(AUTH_SERVICE);

export async function publishEvent(
  topic: string,
  payload: IEventPayload,
): Promise<void> {
  const { error } = await tryCatch(
    kafkaProducer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    }),
  );

  if (error) {
    logger.error(
      `Failed to publish messsage to Kafka producer: ${error.message}`,
    );
  }
}
