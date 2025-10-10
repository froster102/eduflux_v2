import { InstructorViewDITokens } from '@core/application/views/instructor-view/di/InstructorViewDITokens';
import type { InstructorView } from '@core/application/views/instructor-view/entity/InstructorView';
import type { InstructorViewRepositoryPort } from '@core/application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import type {
  GetInstructorViewPort,
  GetInstructorViewUseCase,
} from '@core/application/views/instructor-view/usecase/GetInstructorViewUseCase';
import { Code } from '@core/common/errors/Code';
import { Exception } from '@core/common/errors/Exception';
import { CoreAssert } from '@core/util/assert/CoreAssert';
import { inject } from 'inversify';

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
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: Code.ENTITY_NOT_FOUND_ERROR.message,
      }),
    );

    return instructorViewEntity;
  }
}
