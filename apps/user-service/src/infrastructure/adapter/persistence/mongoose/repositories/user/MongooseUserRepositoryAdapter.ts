import { Role } from '@core/common/enums/Role';
import type { QueryParameters } from '@core/common/persistence/type/QueryParameters';
import { User } from '@core/domain/user/entity/User';
import type {
  UserQueryParameters,
  UserQueryResults,
} from '@core/domain/user/port/persistence/type/UserQueryParameter';
import type { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { UserMapper } from '@infrastructure/adapter/persistence/mongoose/models/user/mapper/MongooseUserMapper';
import { MongooseUser } from '@infrastructure/adapter/persistence/mongoose/models/user/MongooseUser';
import { MongooseBaseRepositoryAdpater } from '@infrastructure/adapter/persistence/mongoose/repositories/MongooseBaseRepositoryAdpater';
import type { FilterQuery } from 'mongoose';

export class MongooseUserRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<MongooseUser, User>
  implements UserRepositoryPort
{
  constructor() {
    super(MongooseUser, UserMapper);
  }

  async findUsers(
    queryParameters: UserQueryParameters,
    excludeId?: string,
  ): Promise<UserQueryResults> {
    const query: FilterQuery<MongooseUser> = {};

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    if (queryParameters.roles) {
      query.roles = { $in: queryParameters.roles };
    }

    const totalCount = await MongooseUser.countDocuments(query);

    const users = await MongooseUser.find(query)
      .limit(queryParameters.limit || this.defaultLimit)
      .skip(queryParameters.offset || this.defaultOffset);

    return { totalCount, users: UserMapper.toDomainEntities(users) };
  }

  async findInstructors(
    currentUserId: string,
    queryParameters: QueryParameters,
  ): Promise<UserQueryResults> {
    const query: FilterQuery<MongooseUser> = {
      roles: { $in: [Role.INSTRUCTOR] },
      _id: { $ne: currentUserId },
    };

    const totalCount = await MongooseUser.countDocuments(query);
    const instructors = await MongooseUser.find(query)
      .limit(queryParameters.limit || this.defaultLimit)
      .skip(queryParameters.offset || this.defaultOffset);

    return {
      totalCount,
      users: UserMapper.toDomainEntities(instructors),
    };
  }
}
