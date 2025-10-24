import type { Role } from '@core/common/enums/Role';
import type { QueryParameters } from '@core/common/persistence/type/QueryParameters';
import { User } from '@core/domain/user/entity/User';

export type UserQueryResults = {
  users: User[];
  totalCount: number;
};

export interface UserQueryParameters extends QueryParameters {
  roles?: Role[];
}
