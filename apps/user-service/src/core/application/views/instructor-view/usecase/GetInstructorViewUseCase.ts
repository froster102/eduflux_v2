import type { InstructorView } from '@core/application/views/instructor-view/entity/InstructorView';
import type { UseCase } from '@core/common/usecase/UseCase';

export interface GetInstructorViewPort {
  instructorId: string;
}

export interface GetInstructorViewUseCase
  extends UseCase<GetInstructorViewPort, InstructorView> {}
