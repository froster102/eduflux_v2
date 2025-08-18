import { Lecture } from '@/domain/entity/lecture.entity';
import type { ILecture } from '../database/schema/lecture.schema';
import type { IMapper } from './mapper.interface';
import { injectable } from 'inversify';

@injectable()
export class LectureMapper implements IMapper<Lecture, ILecture> {
  toDomain(raw: ILecture): Lecture {
    return Lecture.fromPeristence(
      (raw._id as string).toString(),
      raw.courseId,
      raw.title,
      raw.description,
      raw.assetId,
      raw.preview,
      raw.sortOrder,
      raw.objectIndex,
    );
  }

  toPersistence(raw: Lecture): Partial<ILecture> {
    return {
      _id: raw.id,
      courseId: raw.courseId,
      title: raw.title,
      description: raw.description,
      assetId: raw.assetId,
      preview: raw.preview,
      sortOrder: raw.sortOrder,
      objectIndex: raw.objectIndex,
    };
  }

  toDomainArray(raw: ILecture[]): Lecture[] {
    return raw.map((r) => this.toDomain(r));
  }
}
