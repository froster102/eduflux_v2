import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import { Course } from '@/domain/entity/course.entity';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';

@injectable()
export class GetInstructorCurriculumUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
  ) {}

  async execute(id: string, actor: AuthenticatedUserDto): Promise<Course> {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundException(`Course with ID:${id} not found.`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to view this course.',
      );
    }

    if (!course) {
      throw new NotFoundException(`Course with ID:${id} not found.`);
    }

    return course;
  }
}
