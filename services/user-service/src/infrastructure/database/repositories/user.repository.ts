import { IUserRepository } from '@/domain/repositories/user.repository';
import { BaseMongoRepositoryImpl } from './base.repository';
import UserModel from '../models/user.model';
import { User } from '@/domain/entities/user.entity';
import { UserMapper } from '@/infrastructure/mappers/user.mapper';
import { injectable } from 'inversify';
import { IMongoUser } from '../schema/user.schema';

@injectable()
export class UserMongoRepositoryImpl
  extends BaseMongoRepositoryImpl<IMongoUser, User>
  implements IUserRepository
{
  constructor() {
    super(UserModel, new UserMapper());
  }
}
