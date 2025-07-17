import type { IUseCase } from './interface/use-case.interface';
import type { IProgressRepository } from '@/domain/repositories/progress.repository';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '../exceptions/not-found.exception';

export interface GetUserCourseProgessInput {
  courseId: string;
  userId: string;
}

export interface GetUserCourseProgressOutput {
  id: string;
  completedLectures: string[];
}

export class GetUserCourseProgressUseCase
  implements IUseCase<GetUserCourseProgessInput, GetUserCourseProgressOutput>
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
      throw new NotFoundException('Progress not found.');
    }

    return {
      id: progress.courseId,
      completedLectures: progress.completedLectures,
    };
  }
}
