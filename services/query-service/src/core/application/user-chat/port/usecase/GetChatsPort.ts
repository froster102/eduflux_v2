import type { QueryParameters } from "@core/common/port/persistence/type/QueryParameters";
import type { Role } from "@shared/constants/roles";

export interface GetUserChatsPort {
  userId: string;
  role: Role;
  queryParameters?: QueryParameters;
}
