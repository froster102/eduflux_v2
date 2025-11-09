import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { CreateLecturePort } from '@core/application/lecture/port/usecase/CreateLecturePort';
import type { CreateLectureUseCase } from '@core/application/lecture/usecase/CreateLectureUseCase';
import { Lecture } from '@core/domain/lecture/entity/Lecture';
import { ForbiddenException } from '@eduflux-v2/shared/exceptions/ForbiddenException';
import { NotFoundException } from '@eduflux-v2/shared/exceptions/NotFoundException';
import { inject } from 'inversify';
import { CoreAssert } from '@eduflux-v2/shared/utils/CoreAssert';

export class CreateLectureService implements CreateLectureUseCase {
  constructor(
    @inject(LectureDITokens.LectureRepository)
    private readonly lectureRepository: LectureRepositoryPort,
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  async execute(payload: CreateLecturePort): Promise<Lecture> {
    const { courseId, title, description, preview, actor } = payload;

    const course = CoreAssert.notEmpty(
      await this.courseRepository.findById(courseId),
      new NotFoundException(`Course with ID:${courseId} not found.`),
    );

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this course.',
      );
    }

    const lecture = Lecture.create({
      courseId,
      title,
      description,
      preview,
      sortOrder: 0,
      objectIndex: 0,
    });

    const savedLecture = await this.lectureRepository.save(lecture);

    return savedLecture;
  }
}
