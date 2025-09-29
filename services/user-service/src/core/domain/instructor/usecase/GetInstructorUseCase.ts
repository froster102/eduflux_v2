import type { UseCase } from '@core/common/usecase/UseCase';
import type { InstructorUserCaseDto } from '@core/domain/instructor/usecase/dto/InstructorUseCaseDto';
import type { GetInstructorPort } from '@core/domain/instructor/usecase/types/GetInstructorPort';

export interface GetInstructorUseCase
  extends UseCase<GetInstructorPort, InstructorUserCaseDto> {}
