import { Role } from '@eduflux-v2/shared/constants/Role';
import { User } from '@domain/user/entity/User';
import type {
  UserQueryParameters,
  UserQueryResults,
} from '@application/user/port/persistence/types/UserQueryParameter';
import type { UserRepositoryPort } from '@application/user/port/persistence/UserRepositoryPort';
import { UserMapper } from '@infrastructure/adapter/persistence/mongoose/models/user/mapper/MongooseUserMapper';
import { MongooseUser } from '@infrastructure/adapter/persistence/mongoose/models/user/MongooseUser';
import type { FilterQuery } from 'mongoose';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import type { PaginationQueryParams } from '@eduflux-v2/shared/ports/persistence/types/PaginationQueryParameters';

export class MongooseUserRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<User, MongooseUser>
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
    queryParameters: PaginationQueryParams,
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
