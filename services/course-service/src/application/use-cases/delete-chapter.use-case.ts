import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export interface DeleteChapterDto {
  courseId: string;
  chapterId: string;
}

@injectable()
export class DeleteChapterUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
  ) {}

  async execute(
    dto: DeleteChapterDto,
    actor: AuthenticatedUserDto,
  ): Promise<void> {
    const { courseId, chapterId } = dto;
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
      throw new NotFoundException(
        `Chapter with ID:${dto.chapterId} not found.`,
      );
    }

    return;
  }
}
