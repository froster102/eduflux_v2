import type { ChatRepositoryPort } from "@core/application/chat/port/persistence/ChatRepositoryPort";
import type { ChatQueryResult } from "@core/application/chat/port/persistence/type/ChatQueryResult";
import type { Role } from "@core/common/enum/Role";
import type { PaginationQueryParams } from "@core/common/port/persistence/type/QueryParameters";
import type { Chat } from "@core/domain/chat/entity/Chat";
import { MongooseBaseRepositoryAdpater } from "@infrastructure/adapter/persistence/mongoose/base/MongooseBaseRepositoryAdapter";
import { MongooseChatMapper } from "@infrastructure/adapter/persistence/mongoose/model/chat/mapper/MongooseChatMapper";
import {
  ChatModel,
  type MongooseChat,
} from "@infrastructure/adapter/persistence/mongoose/model/chat/MongooseChat";
import type { FilterQuery } from "mongoose";

export class MongooseChatRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<MongooseChat, Chat>
  implements ChatRepositoryPort
{
  constructor() {
    super(ChatModel, MongooseChatMapper);
  }

  async findByUserIdAndRole(
    userId: string,
    role: Role,
    queryParameters?: PaginationQueryParams,
  ): Promise<ChatQueryResult> {
    const query: FilterQuery<MongooseChat> = {
      participants: {
        $elemMatch: {
          userId: userId,
          role: role,
        },
      },
    };
    const limit = queryParameters?.limit || this.defaultLimit;
    const offset = queryParameters?.offset || this.defaultOffset;

    const totalCount = await ChatModel.countDocuments(query);

    const chats = await ChatModel.find(query).skip(offset).limit(limit);

    return {
      chats: MongooseChatMapper.toDomainEntities(chats),
      totalCount,
    };
  }

  async findExistingChat(userIds: string[]): Promise<Chat | null> {
    const query: FilterQuery<MongooseChat> = {
      "participants.userId": { $all: userIds },
      participants: { $size: userIds.length },
    };

    const existingChat = await ChatModel.findOne(query).exec();
    return existingChat ? MongooseChatMapper.toDomain(existingChat) : null;
  }
}
