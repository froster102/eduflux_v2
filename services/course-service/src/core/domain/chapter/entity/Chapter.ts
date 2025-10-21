import { Entity } from '@core/common/entity/Entity';
import type { CreateChapterPayload } from './types/CreateChapterPayload';
import type { NewChapterPayload } from './types/NewChapterPayload';

export class Chapter extends Entity<string> {
  private _class: ClassType = 'chapter';
  private readonly _courseId: string;
  private _title: string;
  private _description: string;
  private _sortOrder: number;
  private _objectIndex: number;

  private constructor(payload: NewChapterPayload) {
    super(payload.id);
    this._courseId = payload.courseId;
    this._title = payload.title;
    this._description = payload.description;
    this._sortOrder = payload.sortOrder;
    this._objectIndex = payload.objectIndex;
  }

  get class(): ClassType {
    return this._class;
  }

  get courseId(): string {
    return this._courseId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get sortOrder(): number {
    return this._sortOrder;
  }

  get objectIndex(): number {
    return this._objectIndex;
  }

  updateDetails(newTitle: string, newDescription: string): void {
    this._title = newTitle;
    this._description = newDescription;
  }

  setSortOrder(newSortOrder: number): void {
    this._sortOrder = newSortOrder;
  }

  setObjectIndex(newObjectIndex: number): void {
    this._objectIndex = newObjectIndex;
  }

  static create(payload: CreateChapterPayload): Chapter {
    return new Chapter({
      id: crypto.randomUUID(),
      courseId: payload.courseId,
      title: payload.title,
      description: payload.description,
      sortOrder: payload.sortOrder,
      objectIndex: payload.objectIndex,
    });
  }

  static new(payload: NewChapterPayload): Chapter {
    return new Chapter(payload);
  }
}
