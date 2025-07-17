import type { IUseCase } from './interface/use-case.interface';
import type { IProgressRepository } from '@/domain/repositories/progress.repository';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export interface DeleteLectureProgressInput {
  userId: string;
  courseId: string;
  lectureId: string;
}

export class DeleteLectureProgressUseCase
  implements IUseCase<DeleteLectureProgressInput, void>
{
  constructor(
    @inject(TYPES.ProgressRepository)
    private readonly progressRepository: IProgressRepository,
  ) {}

  async execute(deleteLectureInput: DeleteLectureProgressInput): Promise<void> {
    const { courseId, lectureId, userId } = deleteLectureInput;

    const progress = await this.progressRepository.findByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (!progress) {
      throw new NotFoundException('Progress not found.');
    }

    progress.removeLecture(lectureId);

    await this.progressRepository.update(progress.id, progress);
  }
}
