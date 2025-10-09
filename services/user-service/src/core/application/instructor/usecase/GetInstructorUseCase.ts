import type { InstructorUserCaseDto } from '@core/application/instructor/usecase/dto/InstructorUseCaseDto';
import type { GetInstructorPort } from '@core/application/instructor/usecase/types/GetInstructorPort';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetInstructorUseCase
  extends UseCase<GetInstructorPort, InstructorUserCaseDto> {}
