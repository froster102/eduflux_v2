import type { IRoute } from './interface/routes.interface';
import type { IUseCase } from '@/application/use-cases/interface/use-case.interface';
import { TYPES } from '@/shared/di/types';
import { inject, injectable } from 'inversify';
import { Elysia } from 'elysia';
import { UpdateUserInput } from '@/application/use-cases/update-user.use-case';
import { authenticaionMiddleware } from '@/infrastructure/http/middlewares/authentication.middleware';
import { User } from '@/domain/entities/user.entity';
import httpStatus from 'http-status';
import {
  updateUserSchema,
  updateUserSessionPricingSchema,
} from '@/infrastructure/http/schema/user';
import {
  GetUserSessionPriceInput,
  GetUserSessionPriceOutput,
} from '@/application/use-cases/get-user-session-price.use-case';
import { UpdateUserSessionPriceInput } from '@/application/use-cases/update-user-session-price.use-case';
import { paginationQuerySchema } from '@/infrastructure/http/schema/pagination';
import {
  GetInstructorsInput,
  GetInstructorsOutput,
} from '@/application/use-cases/get-instructors.use-case';

@injectable()
export class UserRoutes implements IRoute<Elysia> {
  constructor(
    @inject(TYPES.GetUserUseCase)
    private readonly getUserUseCase: IUseCase<string, User>,
    @inject(TYPES.UpdateUserUseCase)
    private readonly updateUserUseCase: IUseCase<UpdateUserInput, User>,
    @inject(TYPES.GetInstructorProfileUseCase)
    private readonly getInstructorProfileUseCase: IUseCase<string, User>,
    @inject(TYPES.GetUserSessionPriceUseCase)
    private readonly getUserSessionPriceUseCase: IUseCase<
      GetUserSessionPriceInput,
      GetUserSessionPriceOutput
    >,
    @inject(TYPES.UpdateUserSessionPriceUseCase)
    private readonly updateUserSessionPriceUseCase: IUseCase<
      UpdateUserSessionPriceInput,
      void
    >,
    @inject(TYPES.GetInstructorsUseCase)
    private readonly getInstructorsUseCase: IUseCase<
      GetInstructorsInput,
      GetInstructorsOutput
    >,
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
