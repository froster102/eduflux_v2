import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import { Chapter } from '@/domain/entity/chapter.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export interface CreateChapterDto {
  courseId: string;
  title: string;
  description: string;
}

export class CreateChapterUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
  ) {}

  async execute(
    dto: CreateChapterDto,
    actor: AuthenticatedUserDto,
  ): Promise<Chapter> {
    const course = await this.courseRepository.findById(dto.courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${dto.courseId} not found.`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        `You are not authorized to modify this course`,
      );
    }

    const totalChapeter = await this.chapterRepository.getTotalItems();
    const totalLectures = await this.lectureRepository.getTotalItems();

    const maxSortOrder = totalChapeter + totalLectures;

    const newSortOrder = Math.max(maxSortOrder, -1) + 1;

    const maxObjectIndex = await this.chapterRepository.getMaxObjectIndex(
      dto.courseId,
    );

    const newObjectIndex = maxObjectIndex + 1;

    const chapter = Chapter.create(
      course.id,
      dto.title,
      dto.description,
      newSortOrder,
      newObjectIndex,
    );

    const savedChapter = await this.chapterRepository.save(chapter);

    return savedChapter;
  }
}
