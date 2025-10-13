// import type { IGetUserSubscribedCoursesUseCase } from '@/application/use-cases/interface/get-user-subscribed-courses.interface';
// import type { IGetSubscriberLectureUseCase } from '@/application/use-cases/interface/get-subscriber-lecture.interface';
// import type { IGetAllInstructorCoursesUseCase } from '@/application/use-cases/interface/get-all-instructor-course.interface';
// import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
// import { TYPES } from '@/shared/di/types';
// import Elysia from 'elysia';
// import { inject, injectable } from 'inversify';
// import { paginationQuerySchema } from '@/infrastructure/http/schema/pagination.schema';

// @injectable()
// export class CourseRoutes {
//   constructor(
//     @inject(TYPES.GetAllInstructorCoursesUseCase)
//     private readonly getAllInstructorCoursesUseCase: IGetAllInstructorCoursesUseCase,
//     @inject(TYPES.GetUserSubscribedCoursesUseCase)
//     private readonly getUserSubscribedCoursesUseCase: IGetUserSubscribedCoursesUseCase,
//     @inject(TYPES.GetSubscriberLectureUseCase)
//     private readonly getSubscriberLectureUseCase: IGetSubscriberLectureUseCase,
//   ) {}

//   register(): Elysia {
//     return new Elysia().group('/api/courses', (group) =>
//       group
//         .use(authenticaionMiddleware)
//         .get('/me/taught-courses', async ({ user, query }) => {
//           const paredQuery = paginationQuerySchema.parse(query);
//           const response = await this.getAllInstructorCoursesUseCase.execute({
//             actorId: user.id,
//             paginationQueryParams: paredQuery,
//           });
//           return response;
//         })
//         .get('/me/subscribed-courses', async ({ user, query }) => {
//           const parsedQuery = paginationQuerySchema.parse(query);
//           const response = await this.getUserSubscribedCoursesUseCase.execute({
//             userId: user.id,
//             paginationQueryParams: parsedQuery,
//           });
//           return response;
//         })
//         .get(
//           '/me/subscribed-courses/:courseId/lectures/:lectureId',
//           async ({ params, user }) => {
//             const { lecture } = await this.getSubscriberLectureUseCase.execute({
//               courseId: params.courseId,
//               lectureId: params.lectureId,
//               userId: user.id,
//             });
//             return { ...lecture };
//           },
//         ),
//     );
//   }
// }
