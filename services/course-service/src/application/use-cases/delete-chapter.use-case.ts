import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import type {
  DeleteChapterInput,
  IDeleteChapterUseCase,
} from './interface/delete-chapter.interface';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { InvalidInputException } from '../exceptions/invalid-input.exception';

@injectable()
export class DeleteChapterUseCase implements IDeleteChapterUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
  ) {}

  async execute(deleteChapterInput: DeleteChapterInput): Promise<void> {
    const { courseId, chapterId, actor } = deleteChapterInput;

    const foundCourse = await this.courseRepository.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized modify this course.',
      );
    }

    const chapter = await this.chapterRepository.findById(chapterId);

    if (!chapter) {
      throw new NotFoundException('Chapter not found.');
    }

    if (chapter.objectIndex === 1) {
      throw new InvalidInputException(
        'Cannot delete the first chapter due to business rules.',
        'The first chapter of a course cannot be deleted.',
      );
    }

    const deleted = await this.chapterRepository.deleteById(chapterId);

    if (!deleted) {
      throw new NotFoundException(`Chapter with ID:${chapterId} not found.`);
    }

    return;
  }
}
