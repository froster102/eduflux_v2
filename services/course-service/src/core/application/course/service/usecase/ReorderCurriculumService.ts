import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import type { ChapterRepositoryPort } from '@core/application/chapter/port/persistence/ChapterRepositoryPort';
import { ChapterUseCaseDto } from '@core/application/chapter/usecase/dto/ChapterUseCaseDto';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { ReorderCurriculumPort } from '@core/application/course/port/usecase/ReorderCurriculumPort';
import type { ReorderCurriculumUseCase } from '@core/application/course/usecase/ReorderCurriculumUseCase';
import { LectureDITokens } from '@core/application/lecture/di/LectureDITokens';
import type { LectureRepositoryPort } from '@core/application/lecture/port/persistence/LectureRepositoryPort';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';
import { InvalidInputException } from '@core/common/exception/InvalidInputException';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { Chapter } from '@core/domain/chapter/entity/Chapter';
import { Lecture } from '@core/domain/lecture/entity/Lecture';
import { inject } from 'inversify';

export class ReorderCurriculumService implements ReorderCurriculumUseCase {
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
    @inject(LectureDITokens.LectureRepository)
    private readonly lectureRepository: LectureRepositoryPort,
    @inject(ChapterDITokens.ChapterRepository)
    private readonly chapterRepository: ChapterRepositoryPort,
  ) {}

  async execute(payload: ReorderCurriculumPort) {
    const { courseId, items: orderedItems, executor } = payload;

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    if (course.instructor.id !== executor.id) {
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
          ChapterUseCaseDto.fromEntity(chapter);
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
