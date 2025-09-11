import type { MessageRepositoryPort } from "@core/application/message/port/persistence/MessageRepositoryPort";
import type { MessageQueryParameters } from "@core/application/message/port/persistence/type/MessageQueryParameters";
import type { MessageQueryResult } from "@core/application/message/port/persistence/type/MessageQueryResult";
import { Message } from "@core/domain/message/entity/Message";
import { MongooseBaseRepositoryAdpater } from "@infrastructure/adapter/persistence/mongoose/base/MongooseBaseRepositoryAdapter";
import { MongooseMessageMapper } from "@infrastructure/adapter/persistence/mongoose/model/message/mapper/MongooseMessageMapper";
import {
  MessageModel,
  type MongooseMessage,
} from "@infrastructure/adapter/persistence/mongoose/model/message/MongooseMessage";
import type { FilterQuery } from "mongoose";

export class MongooseMessageRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<MongooseMessage, Message>
  implements MessageRepositoryPort
{
  constructor() {
    super(MessageModel, MongooseMessageMapper);
  }

  async findByChatId(
    chatId: string,
    queryParameters?: MessageQueryParameters,
  ): Promise<MessageQueryResult> {
    const query: FilterQuery<MongooseMessage> = { chatId };
    const limit = queryParameters?.limit || this.defaultLimit;
    const before = queryParameters?.before || new Date().toISOString();

    if (before) {
      query.createdAt = { $lt: before };
    }

    const totalCount = await MessageModel.countDocuments(query);
    const messages = await MessageModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return {
      totalCount,
      messages: MongooseMessageMapper.toDomainEntities(messages),
    };
  }
}
