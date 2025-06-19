import type { ICourseRepository } from '@/domain/repositories/course.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import { Lecture } from '@/domain/entity/lecture.entity';
import { TYPES } from '@/shared/di/types';
import { inject } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export interface CreateLectureDto {
  courseId: string;
  title: string;
  description: string;
  preview: boolean;
}

export class CreateLectureUseCase {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
  ) {}

  async execute(
    dto: CreateLectureDto,
    actor: AuthenticatedUserDto,
  ): Promise<Lecture> {
    const course = await this.courseRepository.findById(dto.courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${dto.courseId} not found.`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        'You are not authorized to modify this course.',
      );
    }

    const totalChapeter = await this.chapterRepository.getTotalItems();
    const totalLectures = await this.lectureRepository.getTotalItems();

    const maxSortOrder = totalChapeter + totalLectures;

    const newSortOrder = maxSortOrder + 1;

    const maxObjectIndex = await this.lectureRepository.getMaxObjectIndex(
      dto.courseId,
    );

    const newObjectIndex = maxObjectIndex + 1;

    const lecture = Lecture.create(
      dto.courseId,
      dto.title,
      dto.description,
      dto.preview,
      newSortOrder,
      newObjectIndex,
    );

    const savedLecture = await this.lectureRepository.save(lecture);

    return savedLecture;
  }
}
