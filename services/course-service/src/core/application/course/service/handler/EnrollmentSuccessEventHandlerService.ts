import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { EnrollmentSuccessEventHandler } from '@core/application/course/handler/EnrollmentSuccessEventHandler';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import type { EnrollmentSuccessEvent } from '@core/domain/course/EnrollmentSuccessEvent';
import { inject } from 'inversify';

export class EnrollmentSuccessEventHandlerService
  implements EnrollmentSuccessEventHandler
{
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  async handle(event: EnrollmentSuccessEvent): Promise<void> {
    const { courseId } = event;

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundException(`Course with ID:${courseId} not found.`);
    }

    await this.courseRepository.incrementCourseEnrollmentCount(courseId);
  }
}
