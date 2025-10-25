import type { MessageQueryParameters } from '@core/application/message/port/persistence/type/MessageQueryParameters';
import type { MessageQueryResult } from '@core/application/message/port/persistence/type/MessageQueryResult';
import type { BaseRepositoryPort } from '@core/common/port/persistence/BaseRepositoryPort';
import { Message } from '@core/domain/message/entity/Message';

export interface MessageRepositoryPort extends BaseRepositoryPort<Message> {
  findByChatId(
    chatId: string,
    queryParameters?: MessageQueryParameters,
  ): Promise<MessageQueryResult>;
}
