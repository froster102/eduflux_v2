import type { IEnrollmentServiceGateway } from '../ports/enrollment-service.gateway';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { inject } from 'inversify';
import { PaginationQueryParams } from '../dto/pagination.dto';
import { IUseCase } from './interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { Course } from '@/domain/entity/course.entity';

export interface GetUserSubscribedCoursesInput {
  userId: string;
  paginationQueryParams: PaginationQueryParams;
}

export interface GetUserSubscribedCoursesOutput {
  total: number;
  courses: Course[];
}

export class GetUserSubscribedCoursesUseCase
  implements
    IUseCase<GetUserSubscribedCoursesInput, GetUserSubscribedCoursesOutput>
{
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository,
    @inject(TYPES.EnrollmentServiceGateway)
    private readonly enrollmentServiceGateway: IEnrollmentServiceGateway,
  ) {}

  async execute(
    getUserSubscribedCoursesInput: GetUserSubscribedCoursesInput,
  ): Promise<GetUserSubscribedCoursesOutput> {
    const { userId, paginationQueryParams } = getUserSubscribedCoursesInput;
    const result = await this.enrollmentServiceGateway.getUserEnrollments(
      userId,
      paginationQueryParams,
    );

    const courseIdsToGet = result.enrollments.map(
      (enrollment) => enrollment.courseId,
    );

    const courses = await this.courseRepository.findByIds(courseIdsToGet);

    return { total: result.total, courses };
  }
}
