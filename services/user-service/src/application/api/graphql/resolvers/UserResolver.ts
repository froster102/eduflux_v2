import { UserDITokens } from '@core/domain/user/di/UserDITokens';
import { UserDto } from '@core/domain/user/usecase/dto/UserDto';
import type { GetUsersUseCase } from '@core/domain/user/usecase/GetUsersUseCase';
import DataLoader from 'dataloader';
import { inject } from 'inversify';
import type { Resolvers } from 'src/application/api/graphql/__generated__/resolvers-types';

export class UserResolver {
  private userLoader: DataLoader<string, UserDto | null>;
  constructor(
    @inject(UserDITokens.GetUsersUseCase)
    private readonly getUsersUseCase: GetUsersUseCase,
  ) {
    this.userLoader = new DataLoader(async (ids: readonly string[]) => {
      const users = await this.getUsersUseCase.execute({
        userIds: ids as string[],
      });
      return users;
    });
  }

  getResolvers(): Resolvers {
    return {
      User: {
        __resolveReference: async ({ id }) => {
          return await this.userLoader.load(id);
        },
      },
    };
  }
}
