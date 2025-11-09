import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import type { ChapterRepositoryPort } from '@core/application/chapter/port/persistence/ChapterRepositoryPort';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { InitiateCourseRevisionPort } from '@core/application/course/port/persistence/InitiateCourseRevisionPort';
import type { InitiateCourseRevisionUseCase } from '@core/application/course/usecase/InitiateCourseRevisionUseCase';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';
import { InvalidInputException } from '@eduflux-v2/shared/exceptions/InvalidInputException';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import type { Course } from '@core/domain/course/entity/Course';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import { inject } from 'inversify';

export class InitiateCourseRevisionService
  implements InitiateCourseRevisionUseCase
{
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(ChapterDITokens.ChapterRepository)
    private readonly chapterRepository: ChapterRepositoryPort,
    @inject(LectureDITokens.LectureRepository)
    private readonly lectureRepository: LectureRepositoryPort,
  ) {}

  public async execute(payload: InitiateCourseRevisionPort): Promise<Course> {
    const { publishedCourseId, instructorId } = payload;

    const originalCourse =
      await this.courseRepository.findById(publishedCourseId);
    if (!originalCourse) {
      throw new NotFoundException(
        `Course not found for ID: ${publishedCourseId}`,
      );
    }

    if (originalCourse.instructor.id !== instructorId) {
      throw new ForbiddenException(
        'Only the course instructor can initiate a revision.',
      );
    }
    if (originalCourse.status !== CourseStatus.PUBLISHED) {
      throw new InvalidInputException(
        'A course must be PUBLISHED to start a new revision.',
      );
    }

    const shadowCourseId = crypto.randomUUID();
    const shadowCourse = await this.courseRepository.deepClone(
      publishedCourseId,
      shadowCourseId,
    );

    shadowCourse.markAsUpdateDraft();
    await this.courseRepository.update(shadowCourse.id, shadowCourse);

    await this.chapterRepository.deepCloneByCourseId(
      publishedCourseId,
      shadowCourseId,
    );
    await this.lectureRepository.deepCloneByCourseId(
      publishedCourseId,
      shadowCourseId,
    );

    return shadowCourse;
  }
}
