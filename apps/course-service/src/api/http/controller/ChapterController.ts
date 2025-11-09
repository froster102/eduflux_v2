import { authenticaionMiddleware } from '@api/http/middlewares/authenticationMiddleware';
import Elysia from 'elysia';
import { inject } from 'inversify';
import { createChapterSchema } from '@api/http/validators/createChapterSchema';
import { ChapterDITokens } from '@core/application/chapter/di/ChapterDITokens';
import type { CreateChapterUseCase } from '@core/application/chapter/usecase/CreateChapterUseCase';
import { updateChapterSchema } from '@api/http/validators/updateChapterSchema';
import type { UpdateChapterUseCase } from '@core/application/chapter/usecase/UpdateChapterUseCase';
import type { DeleteChapterUseCase } from '@core/application/chapter/usecase/DeleteChapterUseCase';
import { jsonApiResponse } from '@eduflux-v2/shared/utils/jsonApi';

export class ChapterController {
  constructor(
    @inject(ChapterDITokens.CreateChapterUseCase)
    private readonly createChapterUseCase: CreateChapterUseCase,
    @inject(ChapterDITokens.UpdateChapterUseCase)
    private readonly updateChapterUseCase: UpdateChapterUseCase,
    @inject(ChapterDITokens.DeleteChapterUseCase)
    private readonly deleteChapterUseCase: DeleteChapterUseCase,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/courses/:id/chapters', (group) =>
      group
        .use(authenticaionMiddleware)
        .post('/', async ({ params, user, body }) => {
          const parsedBody = createChapterSchema.parse(body);
          const response = await this.createChapterUseCase.execute({
            actor: user,
            courseId: params.id,
            description: parsedBody.description,
            title: parsedBody.title,
          });
          return jsonApiResponse({ data: response });
        })
        .put('/:chapterId', async ({ params, body, user }) => {
          const parsedBody = updateChapterSchema.parse(body);
          const response = await this.updateChapterUseCase.execute({
            chapterId: params.chapterId,
            courseId: params.id,
            ...parsedBody,
            actor: user,
          });
          return jsonApiResponse({ data: response });
        })
        .delete('/:chapterId', async ({ params, user }) => {
          await this.deleteChapterUseCase.execute({
            chapterId: params.chapterId,
            courseId: params.id,
            actor: user,
          });
          return;
        }),
    );
  }
}
