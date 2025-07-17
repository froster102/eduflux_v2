import type { IUseCase } from './interface/use-case.interface';
import type { IProgressRepository } from '@/domain/repositories/progress.repository';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { Progress } from '@/domain/entities/progress.entity';
import { nanoid } from '@/shared/utils/nanoid';

export interface CreateUserProgressInput {
  userId: string;
  courseId: string;
}

export class CreateUserProgressUseCase
  implements IUseCase<CreateUserProgressInput, void>
{
  constructor(
    @inject(TYPES.ProgressRepository)
    private readonly progressRepository: IProgressRepository,
  ) {}

  async execute(
    createUserProgressInput: CreateUserProgressInput,
  ): Promise<void> {
    const { userId, courseId } = createUserProgressInput;

    const progress = Progress.create(nanoid(), userId, courseId);

    await this.progressRepository.save(progress);
  }
}
