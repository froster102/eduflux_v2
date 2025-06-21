import { nanoid } from '@/shared/utils/nanoid';

export class Lecture {
  private _class: ClassType = 'lecture';
  private _id: string;
  private _courseId: string;
  private _title: string;
  private _description: string;
  private _assetId: string | null;
  private _preview: boolean;
  private _sortOrder: number;
  private _objectIndex: number;

  private constructor(
    id: string,
    courseId: string,
    title: string,
    description: string,
    assetId: string | null,
    preview: boolean,
    sortOrder: number,
    objectIndex: number,
  ) {
    this._id = id;
    this._courseId = courseId;
    this._title = title;
    this._description = description;
    this._assetId = assetId;
    this._preview = preview;
    this._sortOrder = sortOrder;
    this._objectIndex = objectIndex;
  }

  static create(
    courseId: string,
    title: string,
    description: string,
    preview: boolean = false,
    sortOrder: number,
    objectIndex: number,
  ): Lecture {
    return new Lecture(
      nanoid(),
      courseId,
      title,
      description,
      null,
      preview,
      sortOrder,
      objectIndex,
    );
  }

  static fromPeristence(
    id: string,
    courseId: string,
    title: string,
    description: string,
    assetId: string | null,
    preview: boolean,
    sortOrder: number,
    objectIndex: number,
  ): Lecture {
    return new Lecture(
      id,
      courseId,
      title,
      description,
      assetId,
      preview,
      sortOrder,
      objectIndex,
    );
  }

  get id(): string {
    return this._id;
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

  get class(): ClassType {
    return this._class;
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

  toJSON(): object {
    return {
      _class: this._class,
      id: this._id,
      title: this.title,
      courseId: this._courseId,
      description: this.description,
      assetId: this._assetId,
      preview: this._preview,
      sortOrder: this._sortOrder,
      objectIndex: this._objectIndex,
    };
  }
}
