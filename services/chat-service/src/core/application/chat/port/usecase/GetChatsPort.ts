import type { QueryParameters } from "@core/common/port/persistence/type/QueryParameters";

export interface GetChatsPort {
  userId: string;
  role: Role;
  queryParameters?: QueryParameters;
}
