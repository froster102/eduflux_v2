import type { QueryParameters } from '@core/common/persistence/type/QueryParameters';
import { User } from '@core/domain/user/entity/User';

export type InstructorQueryResults = {
  instructors: User[];
  totalCount: number;
};

export type UserQueryResults = {
  users: User[];
  totalCount: number;
};

export interface UserQueryParameters extends QueryParameters {}
