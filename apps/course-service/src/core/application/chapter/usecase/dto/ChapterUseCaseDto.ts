import type { Chapter } from '@core/domain/chapter/entity/Chapter';

export class ChapterUseCaseDto {
  readonly _class: string;
  readonly id: string;
  readonly courseId: string;
  readonly title: string;
  readonly description: string;
  readonly sortOrder: number;
  readonly objectIndex: number;

  private constructor(chapter: Chapter) {
    this.id = chapter.id;
    this.courseId = chapter.courseId;
    this.title = chapter.title;
    this.description = chapter.description;
    this.sortOrder = chapter.sortOrder;
    this.objectIndex = chapter.objectIndex;
    this._class = chapter.class;
  }

  static fromEntity(chapter: Chapter): ChapterUseCaseDto {
    return new ChapterUseCaseDto(chapter);
  }

  static fromEntities(chapters: Chapter[]): ChapterUseCaseDto[] {
    return chapters.map((chapter) => this.fromEntity(chapter));
  }
}
