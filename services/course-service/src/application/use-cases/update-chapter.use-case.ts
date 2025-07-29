import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import type {
  IUpdateChapterUseCase,
  UpdateChapterInput,
} from './interface/update-chapter.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/di/types';
import { NotFoundException } from '@/application/exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { Chapter } from '@/domain/entity/chapter.entity';

@injectable()
export class UpdateChapterUseCase implements IUpdateChapterUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
  ) {}

  async execute(updateChapterInput: UpdateChapterInput): Promise<Chapter> {
    const { updateChapterDto: dto, actor } = updateChapterInput;
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
