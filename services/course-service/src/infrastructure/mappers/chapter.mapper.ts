import { Chapter } from '@/domain/entity/chapter.entity';
import type { IMapper } from './mapper.interface';
import { IChapter } from '../database/schema/chapter.schema';

export class ChapterMapper implements IMapper<Chapter, IChapter> {
  toDomain(raw: IChapter): Chapter {
    return Chapter.fromPersistence(
      (raw._id as string).toString(),
      raw.courseId,
      raw.title,
      raw.description,
      raw.sortOrder,
      raw.objectIndex,
    );
  }

  toPersistence(raw: Chapter): Partial<IChapter> {
    return {
      _id: raw.id,
      courseId: raw.courseId,
      title: raw.title,
      description: raw.description,
      sortOrder: raw.sortOrder,
      objectIndex: raw.objectIndex,
    };
  }

  toDomainArray(raw: IChapter[]): Chapter[] {
    return raw.map((r) => this.toDomain(r));
  }
}
