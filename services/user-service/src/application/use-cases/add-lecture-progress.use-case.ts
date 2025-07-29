import type {
  AddLectureProgressInput,
  IAddLectureProgressUseCase,
} from './interface/add-lecture-progress.interface';
import type { IProgressRepository } from '@/domain/repositories/progress.repository';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export class AddLectureProgressUseCase implements IAddLectureProgressUseCase {
  constructor(
    @inject(TYPES.ProgressRepository)
    private readonly progressRepository: IProgressRepository,
  ) {}

  async execute(completeLectureInput: AddLectureProgressInput): Promise<void> {
    const { courseId, lectureId, userId } = completeLectureInput;

    const progress = await this.progressRepository.findByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (!progress) {
      throw new NotFoundException(
        `Progress for course with ID:${courseId} for user ${userId} not found.`,
      );
    }

    progress.addLecture(lectureId);

    await this.progressRepository.update(progress.id, progress);
  }
}
