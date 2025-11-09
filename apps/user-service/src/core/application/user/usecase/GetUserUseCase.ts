import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';
import type { GetUserPort } from '@application/user/port/usecase/GetUserPort';
import type { UserUseCaseDto } from '@application/user/usecase/dto/UserUseCaseDto';

export interface GetUserUseCase extends UseCase<GetUserPort, UserUseCaseDto> {}
