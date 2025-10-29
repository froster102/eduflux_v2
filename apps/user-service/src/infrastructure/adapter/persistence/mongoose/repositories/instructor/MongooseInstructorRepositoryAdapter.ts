import type { Instructor } from '@domain/instructor/entity/Instructor';
import type { InstructorRepositoryPort } from '@application/instructor/port/persistence/InstructorRepositoryPort';
import { InstructorMapper } from '@infrastructure/adapter/persistence/mongoose/models/instructor/mapper/MongooseInstructorMapper';
import {
  InstructorModel,
  type MongooseInstructor,
} from '@infrastructure/adapter/persistence/mongoose/models/instructor/MongooseInstructor';
import { MongooseBaseRepositoryAdapter } from '@eduflux-v2/shared/adapters/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';

export class MongooseInstructorRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Instructor, MongooseInstructor>
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

  async incrementCourseCreated(
    instructorId: string,
  ): Promise<Instructor | null> {
    const updatedInstructor = await InstructorModel.findByIdAndUpdate(
      instructorId,
      {
        $inc: { totalCourses: 1 },
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
