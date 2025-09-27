import type { UserChatQueryResult } from "@core/application/user-chat/port/persistence/types/UserChatQueryResult";
import type { UserChatRepositoryPort } from "@core/application/user-chat/port/persistence/UserChatRepositoryPort";
import type { QueryParameters } from "@core/common/port/persistence/type/QueryParameters";
import type { Role } from "@shared/constants/roles";
import { MongooseBaseRepositoryAdpater } from "@infrastructure/adapter/persistence/mongoose/base/MongooseBaseRepositoryAdapter";

import type { FilterQuery } from "mongoose";
import {
  UserChatModel,
  type MongooseUserChat,
} from "@infrastructure/adapter/persistence/mongoose/model/user-chat/MongooseUserChat";
import type { UserChat } from "@core/domain/user-chat/entity/UserChat";
import { MongooseUserChatMapper } from "@infrastructure/adapter/persistence/mongoose/model/user-chat/mapper/MongooseUserChatMapper";

export class MongooseUserChatRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<MongooseUserChat, UserChat>
  implements UserChatRepositoryPort
{
  constructor() {
    super(UserChatModel, MongooseUserChatMapper);
  }

  async findByUserIdAndRole(
    userId: string,
    role: Role,
    queryParameters?: QueryParameters,
  ): Promise<UserChatQueryResult> {
    const query: FilterQuery<MongooseUserChat> = {
      participants: {
        $elemMatch: {
          id: userId,
          role: role,
        },
      },
    };

    const limit = queryParameters?.limit || this.defaultLimit;
    const offset = queryParameters?.offset || this.defaultOffset;

    const totalCount = await UserChatModel.countDocuments(query);

    const chats = await UserChatModel.find(query).skip(offset).limit(limit);

    return {
      chats: MongooseUserChatMapper.toDomainEntities(chats),
      totalCount,
    };
  }
}
