import { Role } from '@/shared/types/role';
import { IUseCase } from './use-case.interface';
import { User } from '@/domain/entities/user.entity';

export interface UpdateUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: Role[];
  image?: string;
  bio?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}
export interface IUpdateUserUseCase extends IUseCase<UpdateUserInput, User> {}
