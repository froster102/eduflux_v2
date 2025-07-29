import { User } from '@/domain/entities/user.entity';
import { Role } from '@/shared/types/role';
import { IUseCase } from './use-case.interface';

export interface CreateUserInput {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[];
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

export interface ICreateUserUseCase extends IUseCase<CreateUserInput, User> {}
