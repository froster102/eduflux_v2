import type { UseCase } from "@core/common/usecase/UseCase";
import type { InstructorView } from "@core/domain/instructor-view/entity/InstructorView";

export interface GetInstructorViewPort {
  instructorId: string;
}

export interface GetInstructorViewUseCase
  extends UseCase<GetInstructorViewPort, InstructorView> {}
