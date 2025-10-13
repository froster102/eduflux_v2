import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import type { DeleteLecturePort } from '@core/application/lecture/port/usecase/DeleteLecturePort';
import type { DeleteLectureUseCase } from '@core/application/lecture/usecase/DeleteLectureUseCase';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { inject } from 'inversify';

export class DeleteLectureService implements DeleteLectureUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(LectureDITokens.LectureRepository)
    private readonly lectureRepository: LectureRepositoryPort,
  ) {}

  async execute(payload: DeleteLecturePort): Promise<void> {
    const { courseId, lectureId, actor } = payload;

    const foundCourse = CoreAssert.notEmpty(
      await this.courseRepository.findById(courseId),
      new NotFoundException(`Course with ID:${courseId} not found`),
    );

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this course.',
      );
    }

    CoreAssert.notEmpty(
      await this.lectureRepository.deleteById(lectureId),
      new NotFoundException(`Lecture with ID:${lectureId} not found.`),
    );

    return;
  }
}
