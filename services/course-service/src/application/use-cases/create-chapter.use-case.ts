import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { Chapter } from '@/domain/entity/chapter.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { IUseCase } from './interface/use-case.interface';

export interface CreateChapterDto {
  courseId: string;
  title: string;
  description: string;
}

export interface CreateChapterInput {
  createChapterDto: CreateChapterDto;
  actor: AuthenticatedUserDto;
}

export class CreateChapterUseCase
  implements IUseCase<CreateChapterInput, Chapter>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
  ) {}

  async execute(createChapterInput: CreateChapterInput): Promise<Chapter> {
    const { createChapterDto: dto, actor } = createChapterInput;

    const course = await this.courseRepository.findById(dto.courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${dto.courseId} not found.`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        `You are not authorized to modify this course`,
      );
    }

    const chapter = Chapter.create(course.id, dto.title, dto.description, 0, 0);

    const savedChapter = await this.chapterRepository.save(chapter);

    return savedChapter;
  }
}
