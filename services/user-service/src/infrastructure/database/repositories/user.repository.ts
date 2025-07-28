import type { IMapper } from '@/infrastructure/mappers/mapper.interface';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { BaseMongoRepositoryImpl } from './base.repository';
import UserModel from '../models/user.model';
import { User } from '@/domain/entities/user.entity';
import { inject, injectable } from 'inversify';
import { IMongoUser } from '../schema/user.schema';
import { PaginationQueryParams } from '@/application/dto/pagination.dto';
import { TYPES } from '@/shared/di/types';
import { Role } from '@/shared/types/role';

@injectable()
export class UserMongoRepositoryImpl
  extends BaseMongoRepositoryImpl<IMongoUser, User>
  implements IUserRepository
{
  constructor(
    @inject(TYPES.UserMapper)
    private readonly userMapper: IMapper<User, IMongoUser>,
  ) {
    super(UserModel, userMapper);
  }

  async findInstructors(
    currentUserId: string,
    paginationQueryParams: PaginationQueryParams,
  ): Promise<{ instructors: User[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      searchQuery,
      searchFields,
      filters,
      sortBy,
      sortOrder = 'asc',
    } = paginationQueryParams;

    const query: Record<string, any> = {};
    const options: Record<string, any> = {};

    if (searchQuery && searchFields && searchFields.length > 0) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: searchQuery, $options: 'i' },
      }));
    }

    if (filters) {
      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          const value = filters[key];
          if (Array.isArray(value)) {
            query[key] = { $in: value };
          } else {
            query[key] = value;
          }
        }
      }
    }

    const skip = (page - 1) * limit;
    options.skip = skip;
    options.limit = limit;

    if (sortBy) {
      options.sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    }

    const total = await UserModel.countDocuments(query);

    const result = await UserModel.find(
      {
        ...query,
        roles: { $in: [Role.INSTRUCTOR] },
        _id: { $ne: currentUserId },
      },
      null,
      options,
    );

    return result
      ? {
          instructors: this.userMapper.toDomainArray(result),
          total,
        }
      : { instructors: [], total };
  }
}
