import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import type {
  CreateLectureInput,
  ICreateLectureUseCase,
} from './interface/create-lecture.interface';

import { Lecture } from '@/domain/entity/lecture.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export class CreateLectureUseCase implements ICreateLectureUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
  ) {}

  async execute(createLectureInput: CreateLectureInput): Promise<Lecture> {
    const { courseId, title, description, preview, actor } = createLectureInput;

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this course.',
      );
    }

    const lecture = Lecture.create(courseId, title, description, preview, 0, 0);

    const savedLecture = await this.lectureRepository.save(lecture);

    return savedLecture;
  }
}
