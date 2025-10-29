import type { FilterQuery } from 'mongoose';
import {
  UserChatModel,
  type MongooseUserChat,
} from '@infrastructure/adapter/persistence/mongoose/model/user-chat/MongooseUserChat';
import { MongooseUserChatMapper } from '@infrastructure/adapter/persistence/mongoose/model/user-chat/mapper/MongooseUserChatMapper';
import type { UserChatRepositoryPort } from '@core/application/views/user-chat/port/persistence/UserChatRepositoryPort';
import type { UserChat } from '@core/application/views/user-chat/entity/UserChat';
import type { UserChatQueryResult } from '@core/application/views/user-chat/port/persistence/types/UserChatQueryResult';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';
import type { Role } from '@eduflux-v2/shared/constants/Role';

export class MongooseUserChatRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<UserChat, MongooseUserChat>
  implements UserChatRepositoryPort
{
  constructor() {
    super(UserChatModel, MongooseUserChatMapper);
  }

  async findByUserIdAndRole(
    userId: string,
    role: Role,
    queryParameters?: PaginationQueryParams,
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

  async updateUser(
    userId: string,
    payload: { name: string; image?: string },
  ): Promise<void> {
    const setUpdates: Record<string, any> = {
      'participants.$[elem].name': payload.name,
    };

    if (payload.image !== undefined) {
      setUpdates['participants.$[elem].image'] = payload.image;
    }

    await UserChatModel.updateMany(
      { 'participants.id': userId },
      { $set: setUpdates },
      {
        arrayFilters: [{ 'elem.id': userId }],
      },
    );
  }
}
