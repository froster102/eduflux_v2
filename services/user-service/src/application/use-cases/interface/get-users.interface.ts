import { UserDto } from '@/application/dto/user.dto';
import { IUseCase } from './use-case.interface';

export interface IGetUsersUseCase
  extends IUseCase<readonly string[], UserDto[]> {}
