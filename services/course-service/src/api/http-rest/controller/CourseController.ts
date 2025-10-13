import { authenticaionMiddleware } from '@api/http-rest/middlewares/authenticationMiddleware';
import { paginationSchema } from '@api/http-rest/validation/paginationSchema';
import { CourseDITokens } from '@core/application/course/di/CourseDITokens';
import type { CreateCourseUseCase } from '@core/application/course/usecase/CreateCourseUseCase';
import type { UpdateCourseUseCase } from '@core/application/course/usecase/UpdateCourseUseCase';
import type { GetAllInstructorCoursesUseCase } from '@core/application/course/usecase/GetAllInstructorCoursesUseCase';
import type { GetPublishedCoursesUseCase } from '@core/application/course/usecase/GetPublishedCoursesUseCase';
import type { GetCourseCategoriesUseCase } from '@core/application/course/usecase/GetCourseCategoriesUseCase';
import type { ApproveCourseUseCase } from '@core/application/course/usecase/ApproveCourseUseCase';
import type { RejectCourseUseCase } from '@core/application/course/usecase/RejectCourseUseCase';
import type { PublishCourseUseCase } from '@core/application/course/usecase/PublishCourseUseCase';
import Elysia from 'elysia';
import { inject } from 'inversify';
import type { SubmitCourseForReviewUseCase } from '@core/application/course/usecase/SubmitCourseForReviewUseCase';
import type { GetCourseUseCase } from '@core/application/course/usecase/GetCourseUseCase';
import { getCoursesSchema } from '@api/http-rest/validation/getCoursesSchema';
import { updateCourseSchema } from '@api/http-rest/validation/updateCourseSchema';
import { createCourseSchema } from '@api/http-rest/validation/createCourseSchema';
import { rejectCourseSchema } from '@api/http-rest/validation/rejectCourseSchema';
import { reorderCurriculumSchema } from '@api/http-rest/validation/reorderCurriculumSchema';
import type { ReorderCurriculumUseCase } from '@core/application/course/usecase/ReorderCurriculumUseCase';
import type { GetCourseCurriculumUseCase } from '@core/application/course/usecase/GetCourseCurriculumUseCase';

export class CourseController {
  constructor(
    @inject(CourseDITokens.CreateCourseUseCase)
    private readonly createCourseUseCase: CreateCourseUseCase,
    @inject(CourseDITokens.UpdateCourseUseCase)
    private readonly updateCourseUseCase: UpdateCourseUseCase,
    @inject(CourseDITokens.GetCourseUseCase)
    private readonly getCourseUseCase: GetCourseUseCase,
    @inject(CourseDITokens.GetAllInstructorCoursesUseCase)
    private readonly getAllInstructorCoursesUseCase: GetAllInstructorCoursesUseCase,
    @inject(CourseDITokens.GetPublishedCoursesUseCase)
    private readonly getPublishedCoursesUseCase: GetPublishedCoursesUseCase,
    @inject(CourseDITokens.GetCourseCategoriesUseCase)
    private readonly getCourseCategoriesUseCase: GetCourseCategoriesUseCase,
    @inject(CourseDITokens.ApproveCourseUseCase)
    private readonly approveCourseUseCase: ApproveCourseUseCase,
    @inject(CourseDITokens.RejectCourseUseCase)
    private readonly rejectCourseUseCase: RejectCourseUseCase,
    @inject(CourseDITokens.SubmitForReviewUseCase)
    private readonly submitCourseForReviewUseCase: SubmitCourseForReviewUseCase,
    @inject(CourseDITokens.PublishCourseUseCase)
    private readonly publishCourseUseCase: PublishCourseUseCase,
    @inject(CourseDITokens.ReorderCurriculumUseCase)
    private readonly reorderCurriculumUseCase: ReorderCurriculumUseCase,
    @inject(CourseDITokens.GetCourseCurriculumUseCase)
    private readonly getCourseCurriculumUseCase: GetCourseCurriculumUseCase,
    // @inject(CourseDITokens.SetCoursePricingUseCase)
    // private readonly setCoursePricingUseCase: SetCoursePricingUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group(
      '/api/courses',
      (group) =>
        group
          .use(authenticaionMiddleware)
          .get('/course-categories', async () => {
            const categories = await this.getCourseCategoriesUseCase.execute();
            return { categories };
          })
          .get('/', async ({ query }) => {
            const parsedQuery = getCoursesSchema.parse(query);
            const { totalCount, courses } =
              await this.getPublishedCoursesUseCase.execute({
                query: {
                  offset: (parsedQuery.page - 1) * parsedQuery.limit,
                  limit: parsedQuery.limit,
                  filters: parsedQuery.filters,
                  sort: parsedQuery.sort,
                },
              });
            return {
              pagination: {
                totalPages: Math.ceil(totalCount / parsedQuery.limit),
                currentPage: parsedQuery.page,
              },
              courses,
            };
          })
          .get('/:id', async ({ params, user }) => {
            const course = await this.getCourseUseCase.execute({
              courseId: params.id,
              actor: user,
            });
            return course.toJSON();
          })
          .get('/:id/curriculum', async ({ params, user }) => {
            const response = await this.getCourseCurriculumUseCase.execute({
              id: params.id,
              executor: user,
            });
            return response;
          })
          .get('/:id/instructor-curriculum', async ({ params, user }) => {
            const response = await this.getCourseCurriculumUseCase.execute({
              id: params.id,
              executor: user,
            });
            return { data: response };
          })
          .put('/:id/instructor-curriculum', async ({ params, user, body }) => {
            const parsedBody = reorderCurriculumSchema.parse(body);
            const response = await this.reorderCurriculumUseCase.execute({
              courseId: params.id,
              items: parsedBody.items,
              executor: user,
            });
            return response;
          })
          .post(`/:id/publish`, async ({ params, user }) => {
            await this.publishCourseUseCase.execute({
              actor: user,
              courseId: params.id,
            });
            return { published: true };
          })

          // Instructor routes (authentication required)
          .post('/', async ({ user, body }) => {
            const parsedBody = createCourseSchema.parse(body);
            const course = await this.createCourseUseCase.execute({
              title: parsedBody.title,
              categoryId: parsedBody.categoryId,
              actor: user,
            });
            return course;
          })
          .get('/me/taught-courses', async ({ query, user }) => {
            const parsedQuery = paginationSchema.parse(query);
            const { totalCount, courses } =
              await this.getAllInstructorCoursesUseCase.execute({
                actor: user,
                query: {
                  limit: parsedQuery.limit,
                  offset: (parsedQuery.page - 1) * parsedQuery.limit,
                  // filters: parsedQuery.filters,
                },
              });
            return {
              pagination: {
                totalPages: Math.ceil(totalCount / parsedQuery.limit),
                currentPage: parsedQuery.page,
              },
              courses,
            };
          })
          .put('/:id', async ({ params, user, body }) => {
            const parsedBody = updateCourseSchema.parse(body);
            const course = await this.updateCourseUseCase.execute({
              courseId: params.id,
              updates: parsedBody,
              actor: user,
            });
            return course;
          })
          .post('/:id/submit-for-review', async ({ params, user }) => {
            const course = await this.submitCourseForReviewUseCase.execute({
              courseId: params.id,
              actor: user,
            });
            return course;
          })
          // .post('/:id/pricing', async ({ params, user, body }) => {
          //   const parsedBody = setPricingSchema.parse(body);
          //   const course = await this.setCoursePricingUseCase.execute({
          //     courseId: params.id,
          //     price: parsedBody.price,
          //     isFree: parsedBody.isFree,
          //     actor: user,
          //   });
          //   return course;
          // })
          // Admin routes (authentication required)
          .post('/:id/approve', async ({ params, user }) => {
            const course = await this.approveCourseUseCase.execute({
              courseId: params.id,
              actor: user,
            });
            return course;
          })
          .post('/:id/reject', async ({ params, user, body }) => {
            const parsedBody = rejectCourseSchema.parse(body);
            const course = await this.rejectCourseUseCase.execute({
              courseId: params.id,
              feedback: parsedBody.feedback,
              actor: user,
            });
            return course;
          }),
      // .post('/admin/:id/publish', async ({ params, user }) => {
      //   const parsedParams = getCourseParamsSchema.parse(params);
      //   const course = await this.publishCourseUseCase.execute({
      //     courseId: parsedParams.id,
      //     actor: user,
      //   });
      //   return course;
      // }),
    );
  }
}
