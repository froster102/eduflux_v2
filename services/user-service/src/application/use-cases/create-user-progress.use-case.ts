import type {
  CreateUserProgressInput,
  ICreateUserProgressUseCase,
} from './interface/create-user-progress.interface';
import type { IProgressRepository } from '@/domain/repositories/progress.repository';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { Progress } from '@/domain/entities/progress.entity';
import { nanoid } from '@/shared/utils/nanoid';

export class CreateUserProgressUseCase implements ICreateUserProgressUseCase {
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
