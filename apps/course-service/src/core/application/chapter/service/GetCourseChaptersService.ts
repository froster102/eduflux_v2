import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { ChapterRepositoryPort } from '@core/application/chapter/port/persistence/ChapterRepositoryPort';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { GetCourseChaptersPort } from '@core/application/chapter/port/usecase/GetCourseChaptersPort';
import type { GetCourseChaptersUseCase } from '@core/application/chapter/usecase/GetCourseChaptersUseCase';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { inject } from 'inversify';
import type { Chapter } from '@core/domain/chapter/entity/Chapter';

export class GetCourseChaptersService implements GetCourseChaptersUseCase {
  constructor(
    @inject(ChapterDITokens.ChapterRepository)
    private readonly chapterRepository: ChapterRepositoryPort,
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  async execute(payload: GetCourseChaptersPort): Promise<Chapter[]> {
    const { courseId, actor } = payload;

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        `You are not authorized to access this course`,
      );
    }

    const chapters = await this.chapterRepository.findByCourseId(courseId);

    return chapters;
  }
}
