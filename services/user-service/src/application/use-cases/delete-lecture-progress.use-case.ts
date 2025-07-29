import type {
  DeleteLectureProgressInput,
  IDeleteLectureProgressUseCase,
} from './interface/delete-lecture-progress.interface';
import type { IProgressRepository } from '@/domain/repositories/progress.repository';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export class DeleteLectureProgressUseCase
  implements IDeleteLectureProgressUseCase
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
      throw new NotFoundException(
        `Progress for user with ID:${userId} for course ID:${courseId} not found.`,
      );
    }

    progress.removeLecture(lectureId);

    await this.progressRepository.update(progress.id, progress);
  }
}
