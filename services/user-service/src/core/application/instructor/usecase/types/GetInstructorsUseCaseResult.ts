import type { InstructorUserCaseDto } from '@core/application/instructor/usecase/dto/InstructorUseCaseDto';

export type GetInstructorsUseCaseResult = {
  instructors: InstructorUserCaseDto[];
  totalCount: number;
};
