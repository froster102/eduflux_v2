import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import type { ChapterRepositoryPort } from '@core/application/chapter/port/persistence/ChapterRepositoryPort';
import type { DeleteChapterPort } from '@core/application/chapter/port/usecase/DeleteChatperPort';
import type { DeleteChapterUseCase } from '@core/application/chapter/usecase/DeleteChapterUseCase';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { InvalidInputException } from '@core/common/exception/InvalidInputException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { inject } from 'inversify';

export class DeleteChapterService implements DeleteChapterUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(ChapterDITokens.ChapterRepository)
    private readonly chapterRepository: ChapterRepositoryPort,
  ) {}

  async execute(payload: DeleteChapterPort): Promise<void> {
    const { courseId, chapterId, actor } = payload;

    const foundCourse = CoreAssert.notEmpty(
      await this.courseRepository.findById(courseId),
      new NotFoundException(`Course with ID:${courseId} not found.`),
    );

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized modify this course.',
      );
    }

    const chapter = CoreAssert.notEmpty(
      await this.chapterRepository.findById(chapterId),
      new NotFoundException('Chapter not found.'),
    );

    if (chapter.objectIndex === 1) {
      throw new InvalidInputException(
        'The first chapter of a course cannot be deleted.',
      );
    }

    CoreAssert.notEmpty(
      await this.chapterRepository.deleteById(chapterId),
      new NotFoundException(`Chapter with ID:${chapterId} not found.`),
    );

    return;
  }
}
