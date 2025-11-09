import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { UpdateUserPort } from '@application/user/port/usecase/UpdateUserPort';
import type { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';

export interface UpdateUserUseCase
  extends UseCase<UpdateUserPort, UserUseCaseDto> {}
