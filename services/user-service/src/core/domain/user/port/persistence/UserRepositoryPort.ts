import { User } from '@core/domain/user/entity/User';
import type { BaseRepositoryPort } from '@core/common/port/BaseRepositoryPort';
import type {
  InstructorQueryResults,
  UserQueryParameters,
  UserQueryResults,
} from '@core/domain/user/port/persistence/type/UserQueryParameter';
import type { QueryParameters } from '@core/common/persistence/type/QueryParameters';

export interface UserRepositoryPort extends BaseRepositoryPort<User> {
  findUsers(queryParameters: UserQueryParameters): Promise<UserQueryResults>;
  findInstructors(
    currentUserId: string,
    queryParameters: QueryParameters,
  ): Promise<InstructorQueryResults>;
}
