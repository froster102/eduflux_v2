import type { InstructorView } from '@application/views/instructor-view/entity/InstructorView';
import type { UseCase } from '@eduflux-v2/shared/usecase/UseCase';

export interface GetInstructorViewPort {
  instructorId: string;
}

export interface GetInstructorViewUseCase
  extends UseCase<GetInstructorViewPort, InstructorView> {}
