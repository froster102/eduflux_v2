import type { UseCase } from '@core/common/usecase/UseCase';
import type { GetUserPort } from '@core/domain/user/port/usecase/GetUserPort';
import { UserDto } from '@core/domain/user/usecase/dto/UserDto';

export interface GetUserUseCase extends UseCase<GetUserPort, UserDto> {}
