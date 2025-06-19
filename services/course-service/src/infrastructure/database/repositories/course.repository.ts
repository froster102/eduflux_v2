import { Course } from '@/domain/entity/course.entity';
import { MongoBaseRepository } from './base.repository';
import { ICourse } from '../schema/course.schema';
import CourseModel from '../models/course.model';
import { ICourseRepository } from '@/domain/repositories/course.repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/shared/di/types';
import type { IMapper } from '@/infrastructure/mappers/mapper.interface';

@injectable()
export class MongoCourseRepository
  extends MongoBaseRepository<Course, ICourse>
  implements ICourseRepository
{
  constructor(
    @inject(TYPES.CourseMapper)
    private readonly courseMapper: IMapper<Course, ICourse>,
  ) {
    super(CourseModel, courseMapper);
  }

  async findCourseByInstructorId(
    courseId: string,
    instructorId: string,
  ): Promise<Course | null> {
    const course = await CourseModel.findOne({
      _id: courseId,
      'instructor.id': instructorId,
    });
    return course ? this.courseMapper.toDomain(course) : null;
  }

  async findCourseByTitle(title: string): Promise<Course | null> {
    const course = await CourseModel.findOne({
      title,
    });

    return course ? this.courseMapper.toDomain(course) : null;
  }
}
