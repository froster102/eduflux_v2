import type { IChapterRepository } from '@/domain/repositories/chapter.repository';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { Chapter } from '@/domain/entity/chapter.entity';
import { Lecture } from '@/domain/entity/lecture.entity';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { NotFoundException } from '../exceptions/not-found.exception';
import { InvalidInputException } from '../exceptions/invalid-input.exception';
import { AuthenticatedUserDto } from '../dto/authenticated-user.dto';
import { ForbiddenException } from '../exceptions/forbidden.exception';
import { IUseCase } from './interface/use-case.interface';

export interface ReorderCurriculumDto {
  courseId: string;
  items: { class: ClassType; id: string }[];
}

export interface ReorderCurriculumInput {
  reorderCurriculumDto: ReorderCurriculumDto;
  actor: AuthenticatedUserDto;
}

@injectable()
export class ReorderCurriculumUseCase
  implements IUseCase<ReorderCurriculumInput, void>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.LectureRepository)
    private readonly lectureRepository: ILectureRepository,
    @inject(TYPES.ChapterRepository)
    private readonly chapterRepository: IChapterRepository,
  ) {}

  async execute(reorderCurriculumInput: ReorderCurriculumInput) {
    const { reorderCurriculumDto: dto, actor } = reorderCurriculumInput;
    const { courseId, items: orderedItems } = dto;

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    if (course.instructor.id !== actor.id) {
      throw new ForbiddenException(
        `You are not authorized to modify this course.`,
      );
    }

    const chapters = await this.chapterRepository.findByCourseId(courseId);
    const lectures = await this.lectureRepository.findByCourseId(courseId);

    const existingItems: (Chapter | Lecture)[] = [...lectures, ...chapters];

    const chapterMap = new Map<string, Chapter>();
    const lectureMap = new Map<string, Lecture>();

    existingItems.forEach((item) => {
      if (item instanceof Chapter) {
        chapterMap.set(item.id, item);
      } else if (item instanceof Lecture) {
        lectureMap.set(item.id, item);
      }
    });

    const updatedChapters: Chapter[] = [];
    const updatedLectures: Lecture[] = [];

    let currentChapterObjectIndex = 1;
    let currentLectureObjectIndex = 1;
    for (let i = 0; i < orderedItems.length; i++) {
      const item = orderedItems[i];
      const newSortOrder = i + 1;

      if (item.class === 'chapter') {
        const chapter = chapterMap.get(item.id);
        if (chapter) {
          chapter.setSortOrder(newSortOrder);
          chapter.setObjectIndex(currentChapterObjectIndex++);
          updatedChapters.push(chapter);
          chapter.toJSON();
        } else {
          throw new InvalidInputException(
            `Invalid curriculum items structure.`,
          );
        }
      } else if (item.class === 'lecture') {
        const lecture = lectureMap.get(item.id);
        if (lecture) {
          lecture.setSortOrder(newSortOrder);
          lecture.setObjectIndex(currentLectureObjectIndex++);
          updatedLectures.push(lecture);
          lecture.toJSON();
        } else {
          throw new InvalidInputException(
            `Invalid curriculum items structure.`,
          );
        }
      }
    }

    await this.chapterRepository.updateAll(updatedChapters);
    await this.lectureRepository.updateAll(updatedLectures);
  }
}
