import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { CourseQueryParameters } from '@core/application/course/port/persistence/types/CourseQueryParameters';
import type { CourseQueryResult } from '@core/application/course/port/persistence/types/CourseQueryResult';
import type { Course } from '@core/domain/course/entity/Course';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import { MongooseCourseMapper } from '@infrastructure/adapter/persistence/mongoose/model/course/mapper/MongooseCourseMapper';
import {
  CourseModel,
  type MongooseCourse,
} from '@infrastructure/adapter/persistence/mongoose/model/course/MongooseCourse';
import { MongooseBaseRepositoryAdapter } from '@infrastructure/adapter/persistence/mongoose/repository/base/MongooseBaseRepositoryAdapter';
import { unmanaged } from 'inversify';
import type { ClientSession, FilterQuery } from 'mongoose';

export class MongooseCourseRepositoryAdapter
  extends MongooseBaseRepositoryAdapter<Course, MongooseCourse>
  implements CourseRepositoryPort
{
  constructor(
    @unmanaged()
    session?: ClientSession,
  ) {
    super(CourseModel, MongooseCourseMapper, session);
  }

  async findCourseByInstructorId(
    courseId: string,
    instructorId: string,
  ): Promise<Course | null> {
    const doc = await CourseModel.findOne(
      {
        _id: courseId,
        'instructor.id': instructorId,
      },
      null,
      { session: this.session },
    );
    return doc ? MongooseCourseMapper.toDomainEntity(doc) : null;
  }

  async findCourseByTitle(title: string): Promise<Course | null> {
    const doc = await CourseModel.findOne({ title }, null, {
      session: this.session,
    });
    return doc ? MongooseCourseMapper.toDomainEntity(doc) : null;
  }

  async findAllInstructorCourses(
    instructorId: string,
    query?: CourseQueryParameters,
  ): Promise<CourseQueryResult> {
    const dbQuery: FilterQuery<MongooseCourse> = {
      'instructor.id': instructorId,
    };

    if (query?.filters?.status) {
      dbQuery.status = query.filters.status;
    }

    const limit = query?.limit || this.defaultLimit;
    const skip = query?.offset || this.defaultOffset;

    const totalCount = await CourseModel.countDocuments(dbQuery);
    const courses = await CourseModel.find(dbQuery).limit(limit).skip(skip);

    return {
      totalCount,
      courses: MongooseCourseMapper.toDomainEntities(courses),
    };
  }

  async findAllPublishedCourses(
    query?: CourseQueryParameters,
  ): Promise<CourseQueryResult> {
    const dbQuery: FilterQuery<MongooseCourse> = {
      status: CourseStatus.PUBLISHED,
    };

    // if (query?.filters?.catergory) {
    //   await CategoryModel.fin
    // }

    const limit = query?.limit || this.defaultLimit;
    const skip = query?.offset || this.defaultOffset;

    const totalCount = await CourseModel.countDocuments(dbQuery);
    const courses = await CourseModel.find(dbQuery).limit(limit).skip(skip);

    return {
      totalCount,
      courses: MongooseCourseMapper.toDomainEntities(courses),
    };
  }

  async incrementCourseEnrollmentCount(courseId: string): Promise<void> {
    await CourseModel.findByIdAndUpdate(
      courseId,
      { $inc: { enrollmentCount: 1 }, updatedAt: new Date() },
      { session: this.session },
    );
  }
}
