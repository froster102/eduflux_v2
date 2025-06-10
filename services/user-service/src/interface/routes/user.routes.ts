import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { Elysia } from 'elysia';
import { GetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/update-user.use-case';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import { HttpResponse } from '@/infrastructure/http/interfaces/http-response.interface';
import { User } from '@/domain/entities/user.entity';
import httpStatus from 'http-status';
import { UpdateUserDto } from '@/application/dtos/update-user.dto';
import { updateUserSchema } from '@/shared/validation/schema/update-user';
import { ISignedUploadUrlResponse } from '@/application/ports/file-storage.service';
import { GetUploadUrlUseCase } from '@/application/use-cases/get-signed-url.use-case';

@injectable()
export class UserRoutes {
  constructor(
    @inject(TYPES.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase,
    @inject(TYPES.UpdateUserUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase,
    @inject(TYPES.GetUploadUrlUseCase)
    private readonly getUploadUrlUseCase: GetUploadUrlUseCase,
  ) {}

  setupRoutes(): Elysia {
    return new Elysia().group('/api/users', (group) =>
      group
        .use(authenticaionMiddleware)
        .get('/me', async ({ user, set }): Promise<HttpResponse<User>> => {
          const foundUser = await this.getUserUseCase.execute(user.id);
          set.status = httpStatus.OK;
          return {
            statusCode: httpStatus.OK,
            data: foundUser,
          };
        })
        .put(
          '/me',
          async ({ body, user }): Promise<HttpResponse<User>> => {
            const { firstName, lastName, bio, socialLinks, imageUrl } =
              body as UpdateUserDto;
            const updatedUser = await this.updateUserUseCase.execute({
              id: user.id,
              firstName,
              lastName,
              bio,
              imageUrl,
              socialLinks,
            });
            return { statusCode: httpStatus.OK, data: updatedUser };
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
              statusCode: httpStatus.OK,
              data: signedUrlsResponse,
            };
          },
        ),
    );
  }
}
