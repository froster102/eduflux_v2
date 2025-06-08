import { User } from '../entities/user.entity';
import { IBaseRepository } from './base.repository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUserRepository extends IBaseRepository<User> {}
