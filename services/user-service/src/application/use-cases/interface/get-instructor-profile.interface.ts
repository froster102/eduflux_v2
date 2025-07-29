import { User } from '@/domain/entities/user.entity';
import { IUseCase } from './use-case.interface';

export interface IGetInstructorProfileUseCase extends IUseCase<string, User> {}
