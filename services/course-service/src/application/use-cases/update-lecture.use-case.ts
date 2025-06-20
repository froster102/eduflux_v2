import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Lecture } from '@/domain/entity/lecture.entity';
import { CreateLectureDto } from './create-lecture.use-case';

export interface UpdateLectureDto extends Partial<CreateLectureDto> {
  courseId: string;
  lectureId: string;
}

export class UpdateLectureUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
  ) {}

  async execute(
    dto: UpdateLectureDto,
    actor: AuthenticatedUserDto,
  ): Promise<Lecture> {
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
