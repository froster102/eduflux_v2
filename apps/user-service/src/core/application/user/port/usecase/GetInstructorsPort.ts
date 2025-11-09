import type { UserQueryParameters } from '@application/user/port/persistence/types/UserQueryParameter';

export interface GetInstructorsPort {
  currentUserId: string;
  queryParameters: UserQueryParameters;
}
