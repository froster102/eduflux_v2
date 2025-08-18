import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Lecture } from '@/domain/entity/lecture.entity';
import type {
  IUpdateLectureUseCase,
  UpdateLectureInput,
} from './interface/update-lecture.interface';

export class UpdateLectureUseCase implements IUpdateLectureUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
  ) {}

  async execute(updateLectureInput: UpdateLectureInput): Promise<Lecture> {
    const { updateLectureDto: dto, actor } = updateLectureInput;
    const { courseId, lectureId } = dto;
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${courseId} not found`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to update this course.',
      );
    }

    const lecture = await this.lectureRepository.findById(lectureId);

    if (!lecture) {
      throw new NotFoundException(`Lecture with ID:${lectureId} not found.`);
    }

    lecture.update(
      dto.title ?? lecture.title,
      dto.description ?? lecture.description,
      dto.preview ?? lecture.preview,
    );

    await this.lectureRepository.update(lectureId, lecture);

    return lecture;
  }
}
