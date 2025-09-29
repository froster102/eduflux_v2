import type { QueryParameters } from "@core/common/port/persistence/types/QueryParameters";
import type { Role } from "@shared/constants/roles";

export interface GetUserChatsPort {
  userId: string;
  role: Role;
  queryParameters?: QueryParameters;
}
