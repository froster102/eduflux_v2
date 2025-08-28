import type { UseCase } from '@core/common/usecase/UseCase';
import type { InstructorQueryResults } from '@core/domain/user/port/persistence/type/UserQueryParameter';
import type { GetInstructorsPort } from '@core/domain/user/port/usecase/GetInstructorsPort';

export interface GetInstructorsUseCase
  extends UseCase<GetInstructorsPort, InstructorQueryResults> {}
