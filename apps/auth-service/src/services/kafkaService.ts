import { kafkaProducer } from '@/messaging/kafka/kafka';
import { logger } from '@/shared/utils/logger';
import { tryCatch } from '@eduflux-v2/shared/utils/tryCatch';
import type { Event } from '@eduflux-v2/shared/events/Event';

export async function publishEvent(
  topic: string,
  payload: Event,
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
