import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import type { ChapterRepositoryPort } from '@core/application/chapter/port/persistence/ChapterRepositoryPort';
import type { UpdateChapterPort } from '@core/application/chapter/port/usecase/UpdateChapterPort';
import { ChapterUseCaseDto } from '@core/application/chapter/usecase/dto/ChapterUseCaseDto';
import type { UpdateChapterUseCase } from '@core/application/chapter/usecase/UpdateChapterUseCase';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { inject } from 'inversify';

export class UpdateChapterService implements UpdateChapterUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(ChapterDITokens.ChapterRepository)
    private readonly chapterRepository: ChapterRepositoryPort,
  ) {}

  async execute(payload: UpdateChapterPort): Promise<ChapterUseCaseDto> {
    const { chapterId, title, description, actor, courseId } = payload;

    const foundCourse = CoreAssert.notEmpty(
      await this.courseRepository.findById(courseId),
      new NotFoundException(`Course with ID:${courseId} not found`),
    );

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this course.',
      );
    }

    const chapter = CoreAssert.notEmpty(
      await this.chapterRepository.findById(chapterId),
      new NotFoundException(`Chapter with ID:${chapterId} not found.`),
    );

    chapter.updateDetails(
      title ?? chapter.title,
      description ?? chapter.description,
    );

    await this.chapterRepository.update(chapterId, chapter);

    return ChapterUseCaseDto.fromEntity(chapter);
  }
}
