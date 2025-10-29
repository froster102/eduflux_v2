import { authenticaionMiddleware } from '@api/http/middlewares/authenticationMiddleware';
import { paginationSchema } from '@api/http/validators/paginationSchema';
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
import { getCoursesSchema } from '@api/http/validators/getCoursesSchema';
import { updateCourseSchema } from '@api/http/validators/updateCourseSchema';
import { createCourseSchema } from '@api/http/validators/createCourseSchema';
import { rejectCourseSchema } from '@api/http/validators/rejectCourseSchema';
import { reorderCurriculumSchema } from '@api/http/validators/reorderCurriculumSchema';
import type { ReorderCurriculumUseCase } from '@core/application/course/usecase/ReorderCurriculumUseCase';
import type { GetCourseCurriculumUseCase } from '@core/application/course/usecase/GetCourseCurriculumUseCase';
import {
  jsonApiResponse,
  parseJsonApiQuery,
} from '@eduflux-v2/shared/utils/jsonApi';
import { calculateOffset } from '@eduflux-v2/shared/utils/helper';
import httpStatus from 'http-status';

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
  ) {}

  register(): Elysia {
    return new Elysia().group(
      '/api/courses',
      (group) =>
        group
          .use(authenticaionMiddleware)
          .get('/course-categories', async () => {
            const categories = await this.getCourseCategoriesUseCase.execute();
            return jsonApiResponse({ data: categories });
          })
          .get('/', async ({ query }) => {
            const jsonApiQuery = parseJsonApiQuery(query);
            const parsedQuery = getCoursesSchema.parse(jsonApiQuery);
            const { totalCount, courses } =
              await this.getPublishedCoursesUseCase.execute({
                query: {
                  offset: calculateOffset({
                    number: parsedQuery.page.number,
                    size: parsedQuery.page.size,
                  }),
                  limit: parsedQuery.page.size,
                  filters: parsedQuery.filter,
                  sort: parsedQuery.sort,
                },
              });
            return jsonApiResponse({
              data: courses,
              pageNumber: parsedQuery.page.number,
              pageSize: parsedQuery.page.size,
              totalCount,
            });
          })
          .get('/:id', async ({ params, user }) => {
            const course = await this.getCourseUseCase.execute({
              courseId: params.id,
              actor: user,
            });
            return jsonApiResponse({ data: course });
          })
          .get('/:id/curriculum', async ({ params, user }) => {
            const response = await this.getCourseCurriculumUseCase.execute({
              id: params.id,
              executor: user,
            });
            return jsonApiResponse({ data: response });
          })
          .get('/:id/instructor-curriculum', async ({ params, user }) => {
            const response = await this.getCourseCurriculumUseCase.execute({
              id: params.id,
              executor: user,
            });
            return jsonApiResponse({ data: response });
          })
          .put(
            '/:id/instructor-curriculum',
            async ({ params, user, status, body }) => {
              const parsedBody = reorderCurriculumSchema.parse(body);
              await this.reorderCurriculumUseCase.execute({
                courseId: params.id,
                items: parsedBody.items,
                executor: user,
              });
              status(httpStatus.NO_CONTENT);
              return;
            },
          )
          .post(`/:id/publish`, async ({ params, user }) => {
            await this.publishCourseUseCase.execute({
              actor: user,
              courseId: params.id,
            });
            return jsonApiResponse({ data: { published: true } });
          })

          // Instructor routes (authentication required)
          .post('/', async ({ user, body }) => {
            const parsedBody = createCourseSchema.parse(body);
            const course = await this.createCourseUseCase.execute({
              title: parsedBody.title,
              categoryId: parsedBody.categoryId,
              actor: user,
            });
            return jsonApiResponse({ data: course });
          })
          .get('/me/taught-courses', async ({ query, user }) => {
            const parsedQuery = paginationSchema.parse(query);
            const { totalCount, courses } =
              await this.getAllInstructorCoursesUseCase.execute({
                actor: user,
                query: {
                  limit: parsedQuery.page.size,
                  offset: calculateOffset({
                    number: parsedQuery.page.number,
                    size: parsedQuery.page.size,
                  }),
                },
              });
            return jsonApiResponse({
              totalCount,
              pageNumber: parsedQuery.page.number,
              pageSize: parsedQuery.page.size,
              data: courses,
            });
          })
          .put('/:id', async ({ params, user, body }) => {
            const parsedBody = updateCourseSchema.parse(body);
            const course = await this.updateCourseUseCase.execute({
              courseId: params.id,
              updates: parsedBody,
              actor: user,
            });
            return jsonApiResponse({ data: course });
          })
          .post('/:id/submit-for-review', async ({ params, user }) => {
            const course = await this.submitCourseForReviewUseCase.execute({
              courseId: params.id,
              actor: user,
            });
            return jsonApiResponse({ data: course });
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
            return jsonApiResponse({ data: course });
          })
          .post('/:id/reject', async ({ params, user, body }) => {
            const parsedBody = rejectCourseSchema.parse(body);
            const course = await this.rejectCourseUseCase.execute({
              courseId: params.id,
              feedback: parsedBody.feedback,
              actor: user,
            });
            return jsonApiResponse({ data: course });
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
