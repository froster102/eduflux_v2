import { inject } from 'inversify';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import type { UpdateLecturePort } from '@core/application/lecture/port/usecase/UpdateLecturePort';
import type { UseCase } from '@core/common/usecase/UseCase';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';

export class UpdateLectureService implements UseCase<UpdateLecturePort, void> {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(LectureDITokens.LectureRepository)
    private readonly lectureRepository: LectureRepositoryPort,
  ) {}

  async execute(payload: UpdateLecturePort): Promise<void> {
    const { lectureId, title, description, preview, actor } = payload;

    const lecture = await this.lectureRepository.findById(lectureId);
    if (!lecture) {
      throw new NotFoundException(`Lecture with ID:${lectureId} not found.`);
    }

    const course = await this.courseRepository.findById(lecture.courseId);
    if (!course) {
      throw new NotFoundException(
        `Course with ID:${lecture.courseId} not found`,
      );
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to update this lecture.',
      );
    }

    lecture.update(
      title ?? lecture.title,
      description ?? lecture.description,
      preview ?? lecture.preview,
    );

    await this.lectureRepository.update(lectureId, lecture);
  }
}
