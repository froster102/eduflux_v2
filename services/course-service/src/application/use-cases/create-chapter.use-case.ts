import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { Chapter } from '@/domain/entity/chapter.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import type {
  CreateChapterInput,
  ICreateChapterUseCase,
} from './interface/create-chapter.interface';

export class CreateChapterUseCase implements ICreateChapterUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
  ) {}

  async execute(createChapterInput: CreateChapterInput): Promise<Chapter> {
    const { courseId, description, title, actor } = createChapterInput;

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        `You are not authorized to modify this course`,
      );
    }

    const chapter = Chapter.create(course.id, title, description, 0, 0);

    const savedChapter = await this.chapterRepository.save(chapter);

    return savedChapter;
  }
}
