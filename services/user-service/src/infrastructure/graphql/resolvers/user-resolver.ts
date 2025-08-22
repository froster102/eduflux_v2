import { inject } from 'inversify';
import { TYPES } from '@/shared/di/types';
import DataLoader from 'dataloader';
import type { IGetUsersUseCase } from '@/application/use-cases/interface/get-users.interface';
import type { UserDto } from '@/application/dto/user.dto';
import { Resolvers } from '../__generated__/resolvers-types';

export class UserResolver {
  private userLoader: DataLoader<string, UserDto | null>;
  constructor(
    @inject(TYPES.GetUsersUseCase)
    private readonly getUsersUseCase: IGetUsersUseCase,
  ) {
    this.userLoader = new DataLoader(async (ids: readonly string[]) => {
      const users = await this.getUsersUseCase.execute(ids);
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
