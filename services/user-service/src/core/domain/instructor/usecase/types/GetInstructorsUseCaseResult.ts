import type { InstructorUserCaseDto } from '@core/domain/instructor/usecase/dto/InstructorUseCaseDto';

export type GetInstructorsUseCaseResult = {
  instructors: InstructorUserCaseDto[];
  totalCount: number;
};
