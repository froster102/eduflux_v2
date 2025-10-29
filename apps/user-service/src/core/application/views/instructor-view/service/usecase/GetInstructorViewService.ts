import { InstructorViewDITokens } from '@application/views/instructor-view/di/InstructorViewDITokens';
import type { InstructorView } from '@application/views/instructor-view/entity/InstructorView';
import type { InstructorViewRepositoryPort } from '@application/views/instructor-view/port/persistence/InstructorViewRepositoryPort';
import type {
  GetInstructorViewPort,
  GetInstructorViewUseCase,
} from '@application/views/instructor-view/usecase/GetInstructorViewUseCase';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';
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
      new NotFoundException(),
    );

    return instructorViewEntity;
  }
}
