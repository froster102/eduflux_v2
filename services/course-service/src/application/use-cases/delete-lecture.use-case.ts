import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { IUseCase } from './interface/use-case.interface';

export interface DeleteLectureDto {
  courseId: string;
  lectureId: string;
}

export interface DeleteLectureInput {
  deleteLectureDto: DeleteLectureDto;
  actor: AuthenticatedUserDto;
}

@injectable()
export class DeleteLectureUseCase
  implements IUseCase<DeleteLectureInput, void>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
  ) {}

  async execute(deleteLectureInput: DeleteLectureInput): Promise<void> {
    const { deleteLectureDto, actor } = deleteLectureInput;

    const { courseId, lectureId } = deleteLectureDto;

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
