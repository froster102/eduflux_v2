import { nanoid } from '@/shared/utils/nanoid';

export class Category {
  private _id: string;
  private _title: string;
  private _titleCleaned: string;

  private constructor(id: string, title: string, titleCleaned: string) {
    this._id = id;
    this._title = title;
    this._titleCleaned = titleCleaned;
  }

  static create(title: string): Category {
    const id = nanoid();
    const titleCleaned = Category.cleanTitle(title);

    return new Category(id, title, titleCleaned);
  }

  static fromPersistence(
    id: string,
    title: string,
    titleCleaned: string,
  ): Category {
    return new Category(id, title, titleCleaned);
  }

  private static cleanTitle(title: string): string {
    if (!title) {
      return '';
    }

    const cleaned = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');

    return cleaned;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get titleCleaned(): string {
    return this._titleCleaned;
  }

  //   updateTitle(newTitle: string): void {
  //     if (newTitle && newTitle.trim() !== this._title) {
  //       this._title = newTitle.trim();
  //       this._titleCleaned = Category.cleanTitle(newTitle);
  //     }
  //   }

  toJSON(): object {
    return {
      id: this._id,
      title: this._title,
      titleCleaned: this._titleCleaned,
    };
  }
}
