import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import type {
  DeleteLectureInput,
  IDeleteLectureUseCase,
} from './interface/delete-lecture.interface';

import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';

@injectable()
export class DeleteLectureUseCase implements IDeleteLectureUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
  ) {}

  async execute(deleteLectureInput: DeleteLectureInput): Promise<void> {
    const { courseId, lectureId, actor } = deleteLectureInput;

    const foundCourse = await this.courseRepository.findById(courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with ID:${courseId} not found`);
    }

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this course.',
      );
    }

    const deleted = await this.lectureRepository.deleteById(lectureId);

    if (!deleted) {
      throw new NotFoundException(`Lecture with ID:${lectureId} not found.`);
    }

    return;
  }
}
