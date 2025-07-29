import type { IProgressRepository } from '@/domain/repositories/progress.repository';
import type {
  GetUserCourseProgessInput,
  GetUserCourseProgressOutput,
  IGetUserCourseProgressUseCase,
} from './interface/get-user-course-progress.interface';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export class GetUserCourseProgressUseCase
  implements IGetUserCourseProgressUseCase
{
  constructor(
    @inject(TYPES.ProgressRepository)
    private readonly progressRepository: IProgressRepository,
  ) {}

  async execute(
    getUserCourseProgressInput: GetUserCourseProgessInput,
  ): Promise<GetUserCourseProgressOutput> {
    const { courseId, userId } = getUserCourseProgressInput;

    const progress = await this.progressRepository.findByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (!progress) {
      throw new NotFoundException(
        `Progress for user with ID:${userId} for course ID:${courseId} not found.`,
      );
    }

    return {
      id: progress.courseId,
      completedLectures: progress.completedLectures,
    };
  }
}
