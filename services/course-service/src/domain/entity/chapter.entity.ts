import { nanoid } from '@/shared/utils/nanoid';

export class Chapter {
  private _class: ClassType = 'chapter';
  private _id: string;
  private _courseId: string;
  private _title: string;
  private _description: string;
  private _sortOrder: number;
  private _objectIndex: number;

  private constructor(
    id: string,
    courseId: string,
    title: string,
    description: string,
    sortOrder: number,
    objectIndex: number,
  ) {
    this._id = id;
    this._courseId = courseId;
    this._title = title;
    this._description = description;
    this._sortOrder = sortOrder;
    this._objectIndex = objectIndex;
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

  get sortOrder(): number {
    return this._sortOrder;
  }

  get objectIndex(): number {
    return this._objectIndex;
  }

  get class(): ClassType {
    return this._class;
  }

  static create(
    courseId: string,
    title: string,
    description: string,
    sortOrder: number,
    objectIndex: number,
  ): Chapter {
    return new Chapter(
      nanoid(),
      courseId,
      title,
      description,
      sortOrder,
      objectIndex,
    );
  }

  static fromPersistence(
    id: string,
    courseId: string,
    title: string,
    description: string,
    sortOrder: number,
    objectIndex: number,
  ): Chapter {
    return new Chapter(
      id,
      courseId,
      title,
      description,
      sortOrder,
      objectIndex,
    );
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

  toJSON(): object {
    return {
      _class: this._class,
      id: this._id,
      title: this._title,
      description: this._description,
      sortOrder: this._sortOrder,
      objectIndex: this._objectIndex,
    };
  }
}
