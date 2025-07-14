import { AddAssetToLectureUseCase } from '@/application/use-cases/add-asset-to-lecture.use-case';
import { CreateChapterUseCase } from '@/application/use-cases/create-chapter.use-case';
import { CreateCourseUseCase } from '@/application/use-cases/create-course.use-case';
import { CreateLectureUseCase } from '@/application/use-cases/create-lecture.use-case';
import { GetInstructorCourseCurriculumUseCase } from '@/application/use-cases/get-instructor-course-curriculum.use-case';
import { GetInstructorCourseUseCase } from '@/application/use-cases/get-instructor-course.use-case';
import {
  ReorderCurriculumDto,
  ReorderCurriculumUseCase,
} from '@/application/use-cases/reorder-curriculum.use-case';
import { UpdateChapterUseCase } from '@/application/use-cases/update-chapter.use-case';
import { UpdateCourseUseCase } from '@/application/use-cases/update-course.use-case';
import { UpdateLectureUseCase } from '@/application/use-cases/update-lecture.use-case';
import { Course } from '@/domain/entity/course.entity';
import { HttpResponse } from '@/infrastructure/http/interfaces/http-response.interface';
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
import { DeleteChapterUseCase } from '@/application/use-cases/delete-chapter.use-case';
import { DeleteLectureUseCase } from '@/application/use-cases/delete-lecture.use-case';
import { PublishCourseUseCase } from '@/application/use-cases/publish-course.use-case';
import { GetCourseCategoriesUseCase } from '@/application/use-cases/get-course-categories.use-case';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

@injectable()
export class InstructorRoutes {
  constructor(
    @inject(TYPES.CreateCourseUseCase)
    private readonly creatCourseUseCase: CreateCourseUseCase,
    @inject(TYPES.UpdateCourseUseCase)
    private readonly updateCourseUseCase: UpdateCourseUseCase,
    @inject(TYPES.GetInstructorCourseCurriculumUseCase)
    private readonly getInstructorCourseCurriculum: GetInstructorCourseCurriculumUseCase,
    @inject(TYPES.CreateChapterUseCase)
    private readonly createChapterUseCase: CreateChapterUseCase,
    @inject(TYPES.UpdateChapterUseCase)
    private readonly updateChapterUseCase: UpdateChapterUseCase,
    @inject(TYPES.CreateLectureUseCase)
    private readonly createLectureUseCase: CreateLectureUseCase,
    @inject(TYPES.UpdateLectureUseCase)
    private readonly updateLectureUseCase: UpdateLectureUseCase,
    @inject(TYPES.AddAssetToLectureUseCase)
    private readonly addAssetToLectureUseCase: AddAssetToLectureUseCase,
    // @inject(TYPES.SubmitForReviewUseCase)
    // private readonly submitForReviewUseCase: SubmitForReviewUseCase,
    @inject(TYPES.ReorderCurriculumUseCase)
    private readonly reorderCurriculumUseCase: ReorderCurriculumUseCase,
    @inject(TYPES.GetInstructorCourseUseCase)
    private readonly getInstructorCourseUseCase: GetInstructorCourseUseCase,
    @inject(TYPES.DeleteChapterUseCase)
    private readonly deleteChapterUseCase: DeleteChapterUseCase,
    @inject(TYPES.DeleteLectureUseCase)
    private readonly deleteLectureUseCase: DeleteLectureUseCase,
    @inject(TYPES.PublishCourseUseCase)
    private readonly publishCourseUseCase: PublishCourseUseCase,
    @inject(TYPES.GetCourseCategoriesUseCase)
    private readonly getCourseCategories: GetCourseCategoriesUseCase,
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
              createCourseDto: parsedBody,
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
              updateCourseDto: {
                ...parsedBody,
                courseId: params.courseId,
                description: purify.sanitize(parsedBody.description ?? ''),
              },
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
              const parsedBody = reorderCurriculumSchema.parse(
                body,
              ) as ReorderCurriculumDto;
              await this.reorderCurriculumUseCase.execute({
                reorderCurriculumDto: {
                  courseId: params.courseId,
                  items: parsedBody.items,
                },
                actor: user,
              });
            },
          )
          .post('/:courseId/chapters/', async ({ params, user, body }) => {
            const parsedBody = createChapterSchema.parse(body);
            const chapter = await this.createChapterUseCase.execute({
              createChapterDto: {
                courseId: params.courseId,
                title: parsedBody.title,
                description: parsedBody.description,
              },
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
                deleteChapterDto: {
                  chapterId: params.chapterId,
                  courseId: params.courseId,
                },
                actor: user,
              });
              return;
            },
          )
          .post('/:courseId/lectures/', async ({ params, body, user }) => {
            const parsedBody = createLectureSchema.parse(body);
            const lecture = await this.createLectureUseCase.execute({
              createLectureDto: {
                courseId: params.courseId,
                description: parsedBody.description,
                preview: parsedBody.preview,
                title: parsedBody.title,
              },
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
                deleteLectureDto: {
                  courseId: params.courseId,
                  lectureId: params.lectureId,
                },
              });
            },
          )
          .post(
            '/:courseId/lectures/:lectureId/assets',
            async ({ body, user, params }) => {
              const parsedBody = addAssetToLectureSchema.parse(body);
              await this.addAssetToLectureUseCase.execute({
                addAssetToLectureDto: {
                  resourceType: parsedBody.resourceType as 'image' | 'video',
                  key: parsedBody.key,
                  fileName: parsedBody.fileName,
                  uuid: parsedBody.uuid,
                  courseId: params.courseId,
                  lectureId: params.lectureId,
                },
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
