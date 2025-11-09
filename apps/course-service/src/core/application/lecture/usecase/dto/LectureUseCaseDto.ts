import { Lecture } from '@core/domain/lecture/entity/Lecture';

export class LectureUseCaseDto {
  readonly _class: ClassType;
  readonly id: string;
  readonly courseId: string;
  readonly title: string;
  readonly description: string;
  readonly assetId: string | null;
  readonly preview: boolean;
  readonly sortOrder: number;
  readonly objectIndex: number;

  private constructor(lecture: Lecture) {
    this._class = lecture.class;
    this.id = lecture.id;
    this.courseId = lecture.courseId;
    this.title = lecture.title;
    this.description = lecture.description;
    this.assetId = lecture.assetId;
    this.preview = lecture.preview;
    this.sortOrder = lecture.sortOrder;
    this.objectIndex = lecture.objectIndex;
  }

  static fromEntity(lecture: Lecture) {
    return new LectureUseCaseDto(lecture);
  }

  static fromEntities(lectures: Lecture[]) {
    return lectures.map((lecture) => new LectureUseCaseDto(lecture));
  }
}
