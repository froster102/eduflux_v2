import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import { CourseStatus } from '@core/domain/course/enum/CourseStatus';
import { NotFoundException } from '@core/common/exception/NotFoundException';
import { inject } from 'inversify';
import type { PublishCourseRevisionUseCase } from '@core/application/course/usecase/PublishCourseRevisionUseCase';
import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
import type { PublishCourseRevisionPort } from '@core/application/course/port/persistence/PublishCourseRevisionPort';
import { Role } from '@core/common/enums/Role';
import { ForbiddenException } from '@core/common/exception/ForbiddenException';

export class PublishCourseRevisionService
  implements PublishCourseRevisionUseCase
{
  constructor(
    @inject(CourseDITokens.CourseRepository)
    private readonly courseRepository: CourseRepositoryPort,
  ) {}

  public async execute(payload: PublishCourseRevisionPort): Promise<void> {
    const { shadowCourseId, executor } = payload;

    if (!executor.hasRole(Role.ADMIN)) {
      throw new ForbiddenException('You are not authorized for this action');
    }

    const shadowCourse = await this.courseRepository.findById(shadowCourseId);
    if (!shadowCourse) {
      throw new NotFoundException(`Course not found for ID: ${shadowCourseId}`);
    }

    if (
      shadowCourse.status !== CourseStatus.APPROVED &&
      shadowCourse.status !== CourseStatus.IN_REVIEW
    ) {
      throw new Error(
        `Cannot publish revision from status: ${shadowCourse.status}`,
      );
    }

    const originalCourseId = 'REPLACE_WITH_LOOKUP_LOGIC';

    const originalCourse =
      await this.courseRepository.findById(originalCourseId);
    if (!originalCourse || originalCourse.status !== CourseStatus.PUBLISHED) {
      throw new Error(
        'The original published course is missing or not in PUBLISHED status.',
      );
    }

    await this.courseRepository.swapContent(originalCourse, shadowCourse);

    originalCourse.publish();
    await this.courseRepository.update(originalCourse.id, originalCourse);
  }
}
