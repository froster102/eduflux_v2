import type { Instructor } from '@core/domain/instructor/entity/Instructor';
import type { InstructorRepositoryPort } from '@core/application/instructor/port/persistence/InstructorRepositoryPort';
import { InstructorMapper } from '@infrastructure/adapter/persistence/mongoose/models/instructor/mapper/MongooseInstructorMapper';
import {
  InstructorModel,
  type MongooseInstructor,
} from '@infrastructure/adapter/persistence/mongoose/models/instructor/MongooseInstructor';
import { MongooseBaseRepositoryAdpater } from '@infrastructure/adapter/persistence/mongoose/repositories/MongooseBaseRepositoryAdpater';

export class MongooseInstructorRepositoryAdapter
  extends MongooseBaseRepositoryAdpater<MongooseInstructor, Instructor>
  implements InstructorRepositoryPort
{
  constructor() {
    super(InstructorModel, InstructorMapper);
  }

  async incrementTotalLearners(
    instructorId: string,
  ): Promise<Instructor | null> {
    const instructor = await InstructorModel.findByIdAndUpdate(
      instructorId,
      {
        $inc: { totalLearners: 1 },
        $set: { updatedAt: new Date() },
      },
      {
        new: true,
      },
    );
    return instructor ? InstructorMapper.toDomain(instructor) : null;
  }

  async incrementSessionsConducted(
    instructorId: string,
  ): Promise<Instructor | null> {
    const updatedInstructor = await InstructorModel.findByIdAndUpdate(
      instructorId,
      {
        $inc: { sessionsConducted: 1 },
        $set: { updatedAt: new Date() },
      },
      {
        new: true,
      },
    );

    return updatedInstructor
      ? InstructorMapper.toDomain(updatedInstructor)
      : null;
  }
}
