import type { IMapper } from '@/infrastructure/mappers/mapper.interface';
import type { ILectureRepository } from '@/domain/repositories/lecture.repository';
import type { ILecture } from '../schema/lecture.schema';
import { Lecture } from '@/domain/entity/lecture.entity';
import { MongoBaseRepository } from './base.repository';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import LectureModel from '../models/lecture.model';
import { AnyBulkWriteOperation } from 'mongoose';

export class MongoLectureRepository
  extends MongoBaseRepository<Lecture, ILecture>
  implements ILectureRepository
{
  constructor(
    @inject(TYPES.LectureMapper)
    private readonly lectureMapper: IMapper<Lecture, ILecture>,
  ) {
    super(LectureModel, lectureMapper);
  }

  async findByCourseId(courseId: string): Promise<Lecture[]> {
    const lectures = await LectureModel.find({ courseId });
    return lectures.length > 0
      ? this.lectureMapper.toDomainArray(lectures)
      : [];
  }

  async updateAll(lectures: Lecture[]): Promise<void> {
    const operations: AnyBulkWriteOperation<ILecture>[] = lectures.map(
      (lecture) => ({
        updateOne: {
          filter: {
            _id: lecture.id,
          },
          update: {
            $set: {
              courseId: lecture.courseId,
              title: lecture.title,
              description: lecture.description,
              preview: lecture.preview,
              assetId: lecture.assetId,
              sortOrder: lecture.sortOrder,
              objectIndex: lecture.objectIndex,
            },
          },
        },
      }),
    );
    await LectureModel.bulkWrite(operations);
  }

  async getMaxObjectIndex(courseId: string): Promise<number> {
    const maxObjectIndex = await LectureModel.find({
      courseId,
    }).countDocuments();
    return maxObjectIndex;
  }
}
