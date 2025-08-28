import type { UseCase } from '@core/common/usecase/UseCase';
import type { GetUsersPort } from '@core/domain/user/port/usecase/GetUsersPort';
import { UserDto } from '@core/domain/user/usecase/dto/UserDto';

export interface GetUsersUseCase extends UseCase<GetUsersPort, UserDto[]> {}
