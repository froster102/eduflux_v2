import type { IRoute } from './interface/routes.interface';
import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { Elysia } from 'elysia';
import { UpdateUserInput } from '@/application/use-cases/update-user.use-case';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import { HttpResponse } from '@/infrastructure/http/interfaces/http-response.interface';
import { User } from '@/domain/entities/user.entity';
import httpStatus from 'http-status';
import { updateUserSchema } from '@/shared/validation/schema/update-user';
import { ISignedUploadUrlResponse } from '@/application/ports/file-storage.service';
import { GetUploadUrlUseCase } from '@/application/use-cases/get-signed-url.use-case';

@injectable()
export class UserRoutes implements IRoute<Elysia> {
  constructor(
    @inject(TYPES.GetUserUseCase)
    private readonly getUserUseCase: IUseCase<string, User>,
    @inject(TYPES.UpdateUserUseCase)
    private readonly updateUserUseCase: IUseCase<UpdateUserInput, User>,
    @inject(TYPES.GetUploadUrlUseCase)
    private readonly getUploadUrlUseCase: GetUploadUrlUseCase,
    @inject(TYPES.GetInstructorProfileUseCase)
    private readonly getInstructorProfileUseCase: IUseCase<string, User>,
  ) {}

  register(): Elysia {
    return new Elysia().group('/api/users', (group) =>
      group
        .use(authenticaionMiddleware)
        .get('/me', async ({ user, set }) => {
          const foundUser = await this.getUserUseCase.execute(user.id);
          set.status = httpStatus.OK;
          return foundUser.toJSON();
        })
        .put(
          '/me',
          async ({ body, user }): Promise<HttpResponse<User>> => {
            const { firstName, lastName, bio, socialLinks, imageUrl } = body;
            const updatedUser = await this.updateUserUseCase.execute({
              id: user.id,
              firstName,
              lastName,
              bio,
              imageUrl,
              socialLinks,
            });
            return { data: updatedUser };
          },
          {
            body: updateUserSchema,
          },
        )
        .get(
          '/get-upload-url',
          ({ user }): HttpResponse<ISignedUploadUrlResponse> => {
            const signedUrlsResponse = this.getUploadUrlUseCase.execute(
              user.id,
            );
            return {
              data: signedUrlsResponse,
            };
          },
        )
        .get('/:id', async ({ params }) => {
          const user = await this.getInstructorProfileUseCase.execute(
            params.id,
          );
          return user.toJSON();
        }),
    );
  }
}
