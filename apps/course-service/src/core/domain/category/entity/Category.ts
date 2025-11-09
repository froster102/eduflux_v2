import { Entity } from '@eduflux-v2/shared/entities/Entity';

export interface CreateCategoryPayload {
  title: string;
  titleCleaned: string;
}

export interface NewCategoryPayload {
  id: string;
  title: string;
  titleCleaned: string;
}

export class Category extends Entity<string> {
  private readonly _title: string;
  private readonly _titleCleaned: string;

  private constructor(payload: NewCategoryPayload) {
    super(payload.id);
    this._title = payload.title;
    this._titleCleaned = payload.titleCleaned;
  }

  get title(): string {
    return this._title;
  }

  get titleCleaned(): string {
    return this._titleCleaned;
  }

  static create(payload: CreateCategoryPayload): Category {
    return new Category({
      id: crypto.randomUUID(),
      title: payload.title,
      titleCleaned: payload.titleCleaned,
    });
  }

  static new(payload: NewCategoryPayload): Category {
    return new Category(payload);
  }

  toJSON() {
    return {
      id: this.id,
      title: this._title,
      titleCleaned: this._titleCleaned,
    };
  }
}
