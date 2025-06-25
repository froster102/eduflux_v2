import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { IUseCase } from './interface/use-case.interface';

export interface DeleteChapterDto {
  courseId: string;
  chapterId: string;
}

export interface DeleteChapterInput {
  deleteChapterDto: DeleteChapterDto;
  actor: AuthenticatedUserDto;
}

@injectable()
export class DeleteChapterUseCase
  implements IUseCase<DeleteChapterInput, void>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
  ) {}

  async execute(deleteChapterInput: DeleteChapterInput): Promise<void> {
    const { deleteChapterDto, actor } = deleteChapterInput;

    const { courseId, chapterId } = deleteChapterDto;
    const foundCourse = await this.courseRepository.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized modify this course.',
      );
    }

    const deleted = await this.chapterRepository.deleteById(chapterId);

    if (!deleted) {
      throw new NotFoundException(`Chapter with ID:${chapterId} not found.`);
    }

    return;
  }
}
