import type { IEnrollmentServiceGateway } from '../ports/enrollment-service.gateway';
import type { ICourseRepository } from '@/domain/repositories/course.repository';
import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import type {
  GetUserSubscribedCoursesInput,
  GetUserSubscribedCoursesOutput,
  IGetUserSubscribedCoursesUseCase,
} from './interface/get-user-subscribed-courses.interface';

export class GetUserSubscribedCoursesUseCase
  implements IGetUserSubscribedCoursesUseCase
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
