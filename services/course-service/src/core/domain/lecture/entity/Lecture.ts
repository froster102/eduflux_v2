import { Entity } from '@core/common/entity/Entity';
import type { CreateLecturePayload } from './types/CreateLecturePayload';
import type { NewLecturePayload } from './types/NewLecturePayload';

export class Lecture extends Entity<string> {
  private readonly _class: ClassType = 'lecture';
  private readonly _courseId: string;
  private _title: string;
  private _description: string;
  private _assetId: string | null;
  private _preview: boolean;
  private _sortOrder: number;
  private _objectIndex: number;

  private constructor(payload: NewLecturePayload) {
    super(payload.id);
    this._courseId = payload.courseId;
    this._title = payload.title;
    this._description = payload.description;
    this._assetId = payload.assetId;
    this._preview = payload.preview;
    this._sortOrder = payload.sortOrder;
    this._objectIndex = payload.objectIndex;
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

  get assetId(): string | null {
    return this._assetId;
  }

  get preview(): boolean {
    return this._preview;
  }

  get sortOrder(): number {
    return this._sortOrder;
  }

  get objectIndex(): number {
    return this._objectIndex;
  }

  markAsPreviewable(): void {
    this._preview = true;
  }

  assignMedia(assetId: string): void {
    this._assetId = assetId;
  }

  clearMedia(): void {
    this._assetId = null;
  }

  update(title: string, description: string, preview: boolean): void {
    this._title = title;
    this._description = description;
    this._preview = preview;
  }

  setSortOrder(newSortOrder: number): void {
    this._sortOrder = newSortOrder;
  }

  setObjectIndex(newObjectIndex: number): void {
    this._objectIndex = newObjectIndex;
  }

  static create(payload: CreateLecturePayload): Lecture {
    return new Lecture({
      id: crypto.randomUUID(),
      courseId: payload.courseId,
      title: payload.title,
      description: payload.description,
      assetId: null,
      preview: payload.preview,
      sortOrder: payload.sortOrder,
      objectIndex: payload.objectIndex,
    });
  }

  static new(payload: NewLecturePayload): Lecture {
    return new Lecture(payload);
  }

  toJSON() {
    return {
      _class: this._class,
      id: this._id,
      courseId: this.courseId,
      title: this.title,
      description: this.description,
      assetId: this.assetId,
      preview: this.preview,
      sortOrder: this.sortOrder,
      objectIndex: this.objectIndex,
    };
  }
}
