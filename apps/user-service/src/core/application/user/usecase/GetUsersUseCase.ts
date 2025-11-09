import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { GetUsersPort } from '@application/user/port/usecase/GetUsersPort';
import type { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';

export interface GetUsersUseCase
  extends UseCase<GetUsersPort, UserUseCaseDto[]> {}
