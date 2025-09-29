import { inject, injectable } from "inversify";
import { InstructorViewDITokens } from "@core/application/instructor-view/di/InstructorViewDITokens";
import type { InstructorViewRepositoryPort } from "@core/application/instructor-view/port/persistence/InstructorViewRepositoryPort";
import type {
  GetInstructorViewPort,
  GetInstructorViewUseCase,
} from "@core/application/instructor-view/usecase/GetInstructorViewUseCase";
import type { InstructorView } from "@core/domain/instructor-view/entity/InstructorView";
import { CoreAssert } from "@core/common/util/assert/CoreAssert";
import { InstructorNotFoundException } from "@core/application/instructor-view/exception/InstructorNotFoundException";

@injectable()
export class GetInstructorViewService implements GetInstructorViewUseCase {
  constructor(
    @inject(InstructorViewDITokens.InstructorViewRepository)
    private readonly instructorViewRepository: InstructorViewRepositoryPort,
  ) {}

  public async execute(
    payload: GetInstructorViewPort,
  ): Promise<InstructorView> {
    const { instructorId } = payload;

    const instructorViewEntity = CoreAssert.notEmpty(
      await this.instructorViewRepository.findById(instructorId),
      new InstructorNotFoundException(instructorId),
    );

    return instructorViewEntity;
  }
}
