import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { CreateUserPort } from '@application/user/port/usecase/CreateUserPort';
import { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';

export interface CreateUserUseCase
  extends UseCase<CreateUserPort, UserUseCaseDto> {}
