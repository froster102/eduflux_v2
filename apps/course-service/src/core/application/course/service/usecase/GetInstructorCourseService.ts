// import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
// import type { CourseRepositoryPort } from '@core/application/course/port/persistence/CourseRepositoryPort';
// import type { GetInstructorCoursePort } from '@core/application/course/port/usecase/GetInstructorCoursePort';
// import type { GetInstructorCourseUseCase } from '@core/application/course/usecase/GetInstructorCourseUseCase';
// import { NotFoundException } from '@core/common/exception/NotFoundException';
// import { CoreAssert } from '@core/common/util/assert/CoreAssert';
// import type { Course } from '@core/domain/course/entity/Course';
// import { inject } from 'inversify';

// export class GetInstructorCourseService implements GetInstructorCourseUseCase {
//   constructor(
//     @inject(CourseDITokens.CourseRepository)
//     private readonly courseRepository: CourseRepositoryPort,
//   ) {}

//   async execute(payload: GetInstructorCoursePort): Promise<Course> {
//     const { courseId, actor } = payload;

//     const course = CoreAssert.notEmpty(
//       await this.courseRepository.findCourseByInstructorId(courseId, actor.id),
//       new NotFoundException(
//         `Course with ID:${courseId} not found or you don't have access to it.`,
//       ),
//     );

//     return course;
//   }
// }
