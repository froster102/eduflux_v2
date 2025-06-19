import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Chapter } from '@/domain/entity/chapter.entity';
import { CreateChapterDto } from './create-chapter.use-case';

export interface UpdateChapterDto extends Partial<CreateChapterDto> {
  courseId: string;
  chapterId: string;
}

@injectable()
export class UpdateChapterUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
  ) {}

  async execute(
    dto: UpdateChapterDto,
    actor: AuthenticatedUserDto,
  ): Promise<Chapter> {
    const foundCourse = await this.courseRepository.findById(dto.courseId);

    if (!foundCourse) {
      throw new NotFoundException(`Course with ID:${dto.courseId} not found`);
    }

    if (foundCourse.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this course.',
      );
    }

    const chapter = await this.chapterRepository.findById(dto.chapterId);

    if (!chapter) {
      throw new NotFoundException(
        `Chapter with ID:${dto.chapterId} not found.`,
      );
    }

    chapter.updateDetails(
      dto.title ?? chapter.title,
      dto.description ?? chapter.description,
    );

    await this.chapterRepository.update(dto.chapterId, chapter);

    return chapter;
  }
}
