import { Role } from '@core/common/enums/Role';
import type { QueryParameters } from '@core/common/persistence/type/QueryParameters';
import { User } from '@core/domain/user/entity/User';
import type {
  InstructorQueryResults,
  UserQueryParameters,
  UserQueryResults,
} from '@core/domain/user/port/persistence/type/UserQueryParameter';
import type { UserRepositoryPort } from '@core/domain/user/port/persistence/UserRepositoryPort';
import { UserMapper } from '@infrastructure/adapter/persistence/mongoose/models/user/mapper/MongooseUserMapper';
import {
  type IMongooseUser,
  MongooseUser,
} from '@infrastructure/adapter/persistence/mongoose/models/user/UserModel';
import { MongooseBaseRepositoryAdpater } from '@infrastructure/adapter/persistence/mongoose/repositories/MongooseBaseRepositoryAdpater';
import type { FilterQuery } from 'mongoose';

export class MongooseUserRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<IMongooseUser, User>
  implements UserRepositoryPort
{
  constructor() {
    super(MongooseUser, UserMapper);
  }

  async findUsers(
    queryParameters: UserQueryParameters,
  ): Promise<UserQueryResults> {
    const query: FilterQuery<IMongooseUser> = {};
    const totalCount = await MongooseUser.countDocuments(query);

    const users = await MongooseUser.find({})
      .limit(queryParameters.limit || this.defaultLimit)
      .skip(queryParameters.offset || this.defaultOffset);

    return { totalCount, users: UserMapper.toDomainEntities(users) };
  }

  async findInstructors(
    currentUserId: string,
    queryParameters: QueryParameters,
  ): Promise<InstructorQueryResults> {
    const query: FilterQuery<IMongooseUser> = {
      roles: { $in: [Role.INSTRUCTOR] },
      _id: { $ne: currentUserId },
    };

    const totalCount = await MongooseUser.countDocuments(query);
    const instructors = await MongooseUser.find(query)
      .limit(queryParameters.limit || this.defaultLimit)
      .skip(queryParameters.offset || this.defaultOffset);

    return {
      totalCount,
      instructors: UserMapper.toDomainEntities(instructors),
    };
  }
}
