import type { UserQueryParameters } from '@core/domain/user/port/persistence/type/UserQueryParameter';

export interface GetInstructorsPort {
  currentUserId: string;
  queryParameters: UserQueryParameters;
}
