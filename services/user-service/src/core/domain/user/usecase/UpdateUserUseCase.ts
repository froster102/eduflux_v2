import type { UseCase } from '@core/common/usecase/UseCase';
import type { UpdateUserPort } from '@core/domain/user/port/usecase/UpdateUserPort';
import { UserDto } from '@core/domain/user/usecase/dto/UserDto';

export interface UpdateUserUseCase extends UseCase<UpdateUserPort, UserDto> {}
