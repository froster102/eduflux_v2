import type { IUpdateUserUseCase } from '@/application/use-cases/interface/update-user.interface';
import type { IGetUserUseCase } from '@/application/use-cases/interface/get-user.interface';
import type { IGetInstructorProfileUseCase } from '@/application/use-cases/interface/get-instructor-profile.interface';
import type { IGetUserSessionPriceUseCase } from '@/application/use-cases/interface/get-user-session-price.interface';
import type { IUpdateUserSessionPriceUseCase } from '@/application/use-cases/interface/update-user-session-price.interface';
import type { IGetInstructorsUseCase } from '@/application/use-cases/interface/get-instructors.interface';

import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { Elysia } from 'elysia';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import httpStatus from 'http-status';
import {
  updateUserSchema,
  updateUserSessionPricingSchema,
} from '@/infrastructure/http/schema/user';
import { paginationQuerySchema } from '@/infrastructure/http/schema/pagination';

@injectable()
export class UserRoutes {
  constructor(
    @inject(TYPES.GetUserUseCase)
    private readonly getUserUseCase: IGetUserUseCase,
    @inject(TYPES.UpdateUserUseCase)
    private readonly updateUserUseCase: IUpdateUserUseCase,
    @inject(TYPES.GetInstructorProfileUseCase)
    private readonly getInstructorProfileUseCase: IGetInstructorProfileUseCase,
    @inject(TYPES.GetUserSessionPriceUseCase)
    private readonly getUserSessionPriceUseCase: IGetUserSessionPriceUseCase,
    @inject(TYPES.UpdateUserSessionPriceUseCase)
    private readonly updateUserSessionPriceUseCase: IUpdateUserSessionPriceUseCase,
    @inject(TYPES.GetInstructorsUseCase)
    private readonly getInstructorsUseCase: IGetInstructorsUseCase,
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
          async ({ body, user }) => {
            const { firstName, lastName, bio, socialLinks, image } = body;
            const updatedUser = await this.updateUserUseCase.execute({
              id: user.id,
              firstName,
              lastName,
              bio,
              image,
              socialLinks,
            });
            return { ...updatedUser.toJSON() };
          },
          {
            body: updateUserSchema,
          },
        )
        .get('/me/session-pricing', async ({ user }) => {
          const pricing = await this.getUserSessionPriceUseCase.execute({
            userId: user.id,
          });
          return pricing;
        })
        .put(
          '/me/session-pricing',
          async ({ user, body }) => {
            await this.updateUserSessionPriceUseCase.execute({
              actor: user,
              price: body.price,
            });
            return;
          },
          { body: updateUserSessionPricingSchema },
        )
        .get('/instructors', async ({ query, user }) => {
          const parsedQuery = paginationQuerySchema.parse(query);
          const response = await this.getInstructorsUseCase.execute({
            currentUserId: user.id,
            paginationQueryParams: parsedQuery,
          });
          return response;
        })
        .get('/:id', async ({ params }) => {
          const user = await this.getInstructorProfileUseCase.execute(
            params.id,
          );
          return user.toJSON();
        }),
    );
  }
}
