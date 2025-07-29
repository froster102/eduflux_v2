import { User } from '@/domain/entities/user.entity';
import { IUseCase } from './use-case.interface';

export interface IGetUserUseCase extends IUseCase<string, User> {}
