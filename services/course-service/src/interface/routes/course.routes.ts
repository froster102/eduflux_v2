import type { ICreateCourseUseCase } from '@/application/use-cases/interface/create-course.interface';
import type { IUpdateCourseUseCase } from '@/application/use-cases/interface/update-course.interface';
import type { IGetInstructorCourseCurriculumUseCase } from '@/application/use-cases/interface/get-instructor-course-curriculum.interface';
import type { ICreateChapterUseCase } from '@/application/use-cases/interface/create-chapter.interface';
import type { IUpdateChapterUseCase } from '@/application/use-cases/interface/update-chapter.interface';
import type { ICreateLectureUseCase } from '@/application/use-cases/interface/create-lecture.interface';
import type { IUpdateLectureUseCase } from '@/application/use-cases/interface/update-lecture.interface';
import type { IAddAssetToLectureUseCase } from '@/application/use-cases/interface/add-asset-to-lecture.interface';
import type { IReorderCurriculumUseCase } from '@/application/use-cases/interface/reorder-curriculum.interface';
import type { IGetInstructorCourseUseCase } from '@/application/use-cases/interface/get-instructor-course.interface';
import type { IDeleteChapterUseCase } from '@/application/use-cases/interface/delete-chapter.interface';
import type { IDeleteLectureUseCase } from '@/application/use-cases/interface/delete-lecture.interface';
import type { IPublishCourseUseCase } from '@/application/use-cases/interface/publish-course.use-case.interface';
import type { IGetCourseCategoriesUseCase } from '@/application/use-cases/interface/get-course-categories.interface';
import { Course } from '@/domain/entity/course.entity';
import type { HttpResponse } from '@/infrastructure/http/interfaces/http-response.interface';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import {
  addAssetToLectureSchema,
  createLectureSchema,
  createChapterSchema,
  createCourseSchema,
  reorderCurriculumSchema,
  updateChapterSchema,
  updateCourseSchema,
  updateLessonSchema,
} from '@/infrastructure/http/schema/course.schema';
import { TYPES } from '@/shared/di/types';
import Elysia from 'elysia';
import { inject, injectable } from 'inversify';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

@injectable()
export class InstructorRoutes {
  constructor(
    @inject(TYPES.CreateCourseUseCase)
    private readonly creatCourseUseCase: ICreateCourseUseCase,
    @inject(TYPES.UpdateCourseUseCase)
    private readonly updateCourseUseCase: IUpdateCourseUseCase,
    @inject(TYPES.GetInstructorCourseCurriculumUseCase)
    private readonly getInstructorCourseCurriculum: IGetInstructorCourseCurriculumUseCase,
    @inject(TYPES.CreateChapterUseCase)
    private readonly createChapterUseCase: ICreateChapterUseCase,
    @inject(TYPES.UpdateChapterUseCase)
    private readonly updateChapterUseCase: IUpdateChapterUseCase,
    @inject(TYPES.CreateLectureUseCase)
    private readonly createLectureUseCase: ICreateLectureUseCase,
    @inject(TYPES.UpdateLectureUseCase)
    private readonly updateLectureUseCase: IUpdateLectureUseCase,
    @inject(TYPES.AddAssetToLectureUseCase)
    private readonly addAssetToLectureUseCase: IAddAssetToLectureUseCase,
    // @inject(TYPES.SubmitForReviewUseCase)
    // private readonly submitForReviewUseCase: SubmitForReviewUseCase,
    @inject(TYPES.ReorderCurriculumUseCase)
    private readonly reorderCurriculumUseCase: IReorderCurriculumUseCase,
    @inject(TYPES.GetInstructorCourseUseCase)
    private readonly getInstructorCourseUseCase: IGetInstructorCourseUseCase,
    @inject(TYPES.DeleteChapterUseCase)
    private readonly deleteChapterUseCase: IDeleteChapterUseCase,
    @inject(TYPES.DeleteLectureUseCase)
    private readonly deleteLectureUseCase: IDeleteLectureUseCase,
    @inject(TYPES.PublishCourseUseCase)
    private readonly publishCourseUseCase: IPublishCourseUseCase,
    @inject(TYPES.GetCourseCategoriesUseCase)
    private readonly getCourseCategories: IGetCourseCategoriesUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group(
      '/api/courses',
      (group) =>
        group
          .get('/course-categories', async () => {
            const categories = await this.getCourseCategories.execute();
            return { categories };
          })
          .use(authenticaionMiddleware)
          .post('/', async ({ body, user }): Promise<HttpResponse<Course>> => {
            const parsedBody = createCourseSchema.parse(body);
            const course = await this.creatCourseUseCase.execute({
              ...parsedBody,
              actor: user,
            });
            return { data: course };
          })
          .get('/:courseId/', async ({ params, user }) => {
            const course = await this.getInstructorCourseUseCase.execute({
              id: params.courseId,
              actor: user,
            });
            return course.toJSON();
          })
          .put('/:courseId', async ({ params, user, body }) => {
            const parsedBody = updateCourseSchema.parse(body);
            const course = await this.updateCourseUseCase.execute({
              actor: user,
              ...parsedBody,
              courseId: params.courseId,
              description: purify.sanitize(parsedBody.description ?? ''),
            });
            return course.toJSON();
          })
          .get('/:courseId/instructor-curriculum', async ({ params, user }) => {
            const curriculumItems =
              await this.getInstructorCourseCurriculum.execute({
                id: params.courseId,
                actor: user,
              });
            return { data: curriculumItems };
          })
          .put(
            '/:courseId/instructor-curriculum',
            async ({ body, params, user }) => {
              const parsedBody = reorderCurriculumSchema.parse(body);
              await this.reorderCurriculumUseCase.execute({
                courseId: params.courseId,
                items: parsedBody.items,
                actor: user,
              });
            },
          )
          .post('/:courseId/chapters/', async ({ params, user, body }) => {
            const parsedBody = createChapterSchema.parse(body);
            const chapter = await this.createChapterUseCase.execute({
              courseId: params.courseId,
              title: parsedBody.title,
              description: parsedBody.description,
              actor: user,
            });
            return chapter.toJSON();
          })
          .put(
            '/:courseId/chapters/:chapterId',
            async ({ params, user, body }) => {
              const parsedBody = updateChapterSchema.parse(body);
              const chapter = await this.updateChapterUseCase.execute({
                updateChapterDto: {
                  courseId: params.courseId,
                  chapterId: params.chapterId,
                  title: parsedBody.title,
                  description: parsedBody.description,
                },
                actor: user,
              });
              return chapter.toJSON();
            },
          )
          .delete(
            '/:courseId/chapters/:chapterId',
            async ({ params, user }) => {
              await this.deleteChapterUseCase.execute({
                chapterId: params.chapterId,
                courseId: params.courseId,
                actor: user,
              });
              return;
            },
          )
          .post('/:courseId/lectures/', async ({ params, body, user }) => {
            const parsedBody = createLectureSchema.parse(body);
            const lecture = await this.createLectureUseCase.execute({
              courseId: params.courseId,
              description: parsedBody.description,
              preview: parsedBody.preview,
              title: parsedBody.title,
              actor: user,
            });
            return lecture.toJSON();
          })
          .put(
            '/:courseId/lectures/:lectureId',
            async ({ params, body, user }) => {
              const parsedBody = updateLessonSchema.parse(body);
              const lecture = await this.updateLectureUseCase.execute({
                updateLectureDto: {
                  courseId: params.courseId,
                  lectureId: params.lectureId,
                  description: parsedBody.description,
                  preview: parsedBody.preview,
                  title: parsedBody.title,
                },
                actor: user,
              });
              return lecture.toJSON();
            },
          )
          .delete(
            '/:courseId/lectures/:lectureId',
            async ({ params, user }) => {
              await this.deleteLectureUseCase.execute({
                actor: user,
                courseId: params.courseId,
                lectureId: params.lectureId,
              });
            },
          )
          .post(
            '/:courseId/lectures/:lectureId/assets',
            async ({ body, user, params }) => {
              const parsedBody = addAssetToLectureSchema.parse(body);
              await this.addAssetToLectureUseCase.execute({
                resourceType: parsedBody.resourceType as 'image' | 'video',
                key: parsedBody.key,
                fileName: parsedBody.fileName,
                uuid: parsedBody.uuid,
                courseId: params.courseId,
                lectureId: params.lectureId,
                actor: user,
              });
              return {};
            },
          )
          .post(`/:courseId/publish`, async ({ params, user }) => {
            await this.publishCourseUseCase.execute({
              actor: user,
              courseId: params.courseId,
            });
            return { published: true };
          }),
      // .post('/:courseId/submit-for-review', async ({ user, params }) => {
      //   const course = await this.submitForReviewUseCase.execute({
      //     courseId: params.courseId,
      //     actor: user,
      //   });
      //   return { data: course };
      // })
    );
  }
}
