import { AuthenticatedUserDto } from '@/application/dto/authenticated-user.dto';
import { IUseCase } from './use-case.interface';

export interface UpdateUserSessionPriceInput {
  price: number;
  actor: AuthenticatedUserDto;
}

export interface IUpdateUserSessionPriceUseCase
  extends IUseCase<UpdateUserSessionPriceInput, void> {}
