import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { ChapterRepositoryPort } from '@core/application/chapter/port/persistence/ChapterRepositoryPort';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { CreateChapterPort } from '@core/application/chapter/port/usecase/CreateChapterPort';
import type { CreateChapterUseCase } from '@core/application/chapter/usecase/CreateChapterUseCase';
import { Chapter } from '@core/domain/chapter/entity/Chapter';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { inject } from 'inversify';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { ChapterUseCaseDto } from '@core/application/chapter/usecase/dto/ChapterUseCaseDto';

export class CreateChapterService implements CreateChapterUseCase {
  constructor(
    @inject(ChapterDITokens.ChapterRepository)
    private readonly chapterRepository: ChapterRepositoryPort,
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  async execute(payload: CreateChapterPort): Promise<ChapterUseCaseDto> {
    const { courseId, title, description, actor } = payload;

    const course = CoreAssert.notEmpty(
      await this.courseRepository.findById(courseId),
      new NotFoundException(`Course with ID:${courseId} not found.`),
    );

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        `You are not authorized to modify this course`,
      );
    }

    const chapter = Chapter.create({
      courseId: course.id,
      title,
      description,
      sortOrder: 1,
      objectIndex: 1,
    });

    const savedChapter = await this.chapterRepository.save(chapter);

    return ChapterUseCaseDto.fromEntity(savedChapter);
  }
}
